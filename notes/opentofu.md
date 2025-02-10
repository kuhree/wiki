---
draft: 
publish: true
aliases:
  - opentofu
date: 2024-11-22
updated: 2025-02-09
tags:
  - tools/terraform
up: 
jump: 
down: 
---

## opentofu

Ahh IaC, we've finally made it.

### Getting started

Install `opentofu`

Init a dir - `mkdir ~/tofu && cd ~/tofu && git init`

Then, in the same folder, init tofu - `tofu init`

You should see something like

```txt
...yadayada...
OpenTofu has been successfully initialized
```

Now you can run `tofu plan` to see what's up.

After a few `vi main.tf && tofu plan` loops…

…. commit your changes ….

Run `tofu apply` to make the changes.

… push your changes …

or pack the `plan and apply` steps into CI like you have some sense.

### Providers

The first thing we need is a provider. Let's try the docker one for testing

```tf
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Pulls the image
resource "docker_image" "nixos" {
  name = "nixos/nix:latest"
}

# Create a container
resource "docker_container" "nix" {
  image = docker_image.nixos.image_id
  name  = "tf-nix"
  command = [ "tail", "-f", "/dev/null" ] # Keep the container running...
}
```

Want a remote host,

```tf
provider "docker" {
  host     = "ssh://user@remote-host:22"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}
```

Can even have multiple providers

```tf
terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"

      configuration_aliases = [ docker.local, docker.desktop, docker.laptop ]
    }
  }
}

provider "docker" {
  alias = "local"
  host = "unix:///var/run/docker.sock"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

provider "docker" {
  alias = "desktop"
  host     = "ssh://user@remote1:22"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

provider "docker" {
  alias = "laptop"
  host     = "ssh://user@remote2:22"
  ssh_opts = ["-o", "StrictHostKeyChecking=no", "-o", "UserKnownHostsFile=/dev/null"]
}

# Pulls the image
resource "docker_image" "nixos-desktop" {
  provider = docker.desktop
  name = "nixos/nix:latest"
}

resource "docker_image" "nixos-local" {
  provider = docker.local
  name = "nixos/nix:latest"
}

# Create a container
resource "docker_container" "nix-desktop" {
  provider = docker.desktop
  image = docker_image.nixos-desktop.image_id
  name  = "tf-nix"
  command = [ "tail", "-f", "/dev/null" ] # Keep the container running...
}

resource "docker_container" "nix-local" {
  provider = docker.local
  image = docker_image.nixos-local.image_id
  name  = "tf-nix"
  command = [ "tail", "-f", "/dev/null" ] # Keep the container running...
}
```

#### But, Proxmox?

Yes right, first create a user `terraform-prov@pve` with special permisions:

```bash
pveum role add TerraformProv -privs "Datastore.AllocateSpace Datastore.AllocateTemplate Datastore.Audit Pool.Allocate Sys.Audit Sys.Console Sys.Modify VM.Allocate VM.Audit VM.Clone VM.Config.CDROM VM.Config.Cloudinit VM.Config.CPU VM.Config.Disk VM.Config.HWType VM.Config.Memory VM.Config.Network VM.Config.Options VM.Migrate VM.Monitor VM.PowerMgmt SDN.Use"
pveum user add terraform-prov@pve --password <password>
pveum aclmod / -user terraform-prov@pve -role TerraformProv
```

##### Creating the connection via username and password

When connecting to the Proxmox API, the provider has to know at least three parameters: the URL, username and password. One can supply fields using the provider syntax in Terraform. It is recommended to pass secrets through environment variables.

```bash
export PM_USER="terraform-prov@pve"
export PM_PASS="password"
```

Note: these values can also be set in main.tf but users are encouraged to explore Vault as a way to remove secrets from their HCL.

```tf
provider "proxmox" {
  pm_api_url = "https://proxmox-server01.example.com:8006/api2/json"
}
```

##### Creating the connection via username and API token

```bash
export PM_API_TOKEN_ID="terraform-prov@pve!mytoken"
export PM_API_TOKEN_SECRET="afcd8f45-acc1-4d0f-bb12-a70b0777ec11"
```

```txt
provider "proxmox" {
  pm_api_url = "https://proxmox-server01.example.com:8006/api2/json"
}
```

##### With cloud-init

```tf
/* Uses Cloud-Init options from Proxmox 5.2 */
resource "proxmox_vm_qemu" "cloudinit-test" {
  name        = "tftest1.xyz.com"
  desc        = "tf description"
  target_node = "proxmox1-xx"

  clone = "ci-ubuntu-template"

  # The destination resource pool for the new VM
  pool = "pool0"

  storage = "local"
  cores   = 3
  sockets = 1
  memory  = 2560
  disk_gb = 4
  nic     = "virtio"
  bridge  = "vmbr0"

  ssh_user        = "root"
  ssh_private_key = <<EOF
-----BEGIN RSA PRIVATE KEY-----
private ssh key root
-----END RSA PRIVATE KEY-----
EOF

  os_type   = "cloud-init"
  ipconfig0 = "ip=10.0.2.99/16,gw=10.0.2.2"

  sshkeys = <<EOF
ssh-rsa AABB3NzaC1kj...key1
ssh-rsa AABB3NzaC1kj...key2
EOF

  provisioner "remote-exec" {
    inline = [
      "ip a"
    ]
  }
}

# Modify path for templatefile and use the recommended extension of .tftpl for syntax hylighting in code editors.
resource "local_file" "cloud_init_user_data_file" {
  count    = var.vm_count
  content  = templatefile("${var.working_directory}/cloud-inits/cloud-init.cloud_config.tftpl", { ssh_key = var.ssh_public_key, hostname = var.name })
  filename = "${path.module}/files/user_data_${count.index}.cfg"
}

resource "null_resource" "cloud_init_config_files" {
  count = var.vm_count
  connection {
    type     = "ssh"
    user     = "${var.pve_user}"
    password = "${var.pve_password}"
    host     = "${var.pve_host}"
  }

  provisioner "file" {
    source      = local_file.cloud_init_user_data_file[count.index].filename
    destination = "/var/lib/vz/snippets/user_data_vm-${count.index}.yml"
  }
}

/* Configure Cloud-Init User-Data with custom config file */
resource "proxmox_vm_qemu" "cloudinit-test" {
  depends_on = [
    null_resource.cloud_init_config_files,
  ]

  name        = "tftest1.xyz.com"
  desc        = "tf description"
  target_node = "proxmox1-xx"

  clone = "ci-ubuntu-template"

  # The destination resource pool for the new VM
  pool = "pool0"

  storage = "local"
  cores   = 3
  sockets = 1
  memory  = 2560
  disk_gb = 4
  nic     = "virtio"
  bridge  = "vmbr0"

  ssh_user        = "root"
  ssh_private_key = <<EOF
-----BEGIN RSA PRIVATE KEY-----
private ssh key root
-----END RSA PRIVATE KEY-----
EOF

  os_type   = "cloud-init"
  ipconfig0 = "ip=10.0.2.99/16,gw=10.0.2.2"

  /*
    sshkeys and other User-Data parameters are specified with a custom config file.
    In this example each VM has its own config file, previously generated and uploaded to
    the snippets folder in the local storage in the Proxmox VE server.
  */
  cicustom                = "user=local:snippets/user_data_vm-${count.index}.yml"
  /* Create the Cloud-Init drive on the "local-lvm" storage */
  disks {
    ide {
      ide3 {
        cloudinit {
          storage = "local-lvm"
        }
      }
    }
  }

  provisioner "remote-exec" {
    inline = [
      "ip a"
    ]
  }
}

/* Uses custom eth1 user-net SSH portforward */
resource "proxmox_vm_qemu" "preprovision-test" {
  name        = "tftest1.xyz.com"
  desc        = "tf description"
  target_node = "proxmox1-xx"

  clone = "terraform-ubuntu1404-template"

  # The destination resource pool for the new VM
  pool = "pool0"

  cores    = 3
  sockets  = 1
  # Same CPU as the Physical host, possible to add cpu flags
  # Ex: "host,flags=+md-clear;+pcid;+spec-ctrl;+ssbd;+pdpe1gb"
  cpu      = "host"
  numa     = false
  memory   = 2560
  scsihw   = "lsi"
  # Boot from hard disk (c), CD-ROM (d), network (n)
  boot     = "cdn"
  # It's possible to add this type of material and use it directly
  # Possible values are: network,disk,cpu,memory,usb
  hotplug  = "network,disk,usb"
  # Default boot disk
  bootdisk = "virtio0"
  # HA, you need to use a shared disk for this feature (ex: rbd)
  hastate  = ""

  #Display
  vga {
    type   = "std"
    #Between 4 and 512, ignored if type is defined to serial
    memory = 4
  }

  network {
    id    = 0
    model = "virtio"
  }
  network {
    id     = 1
    model  = "virtio"
    bridge = "vmbr1"
  }
  disk {
    id           = 0
    type         = "virtio"
    storage      = "local-lvm"
    storage_type = "lvm"
    size         = "4G"
    backup       = true
  }
  # Serial interface of type socket is used by xterm.js
  # You will need to configure your guest system before being able to use it
  serial {
    id   = 0
    type = "socket"
  }
  preprovision    = true
  ssh_forward_ip  = "10.0.0.1"
  ssh_user        = "terraform"
  ssh_private_key = <<EOF
-----BEGIN RSA PRIVATE KEY-----
private ssh key terraform
-----END RSA PRIVATE KEY-----
EOF

  os_type           = "ubuntu"
  os_network_config = <<EOF
auto eth0
iface eth0 inet dhcp
EOF

  connection {
    type        = "ssh"
    user        = self.ssh_user
    private_key = self.ssh_private_key
    host        = self.ssh_host
    port        = self.ssh_port
  }

  provisioner "remote-exec" {
    inline = [
      "ip a"
    ]
  }
}
```

### Resources

[Working with OpenTofu | OpenTofu](https://opentofu.org/docs/intro/core-workflow/)
[OpenTofu Registry](https://search.opentofu.org/provider/telmate/proxmox/latest)
[Terraform Registry](https://registry.terraform.io/providers/Telmate/proxmox/latest/docs/guides/cloud_init)
