import type { LessonEntry } from "@/types/roadmap";

export const ANSIBLE_INVENTORY_PLAYBOOKS_ROLES: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "Ansible: inventory, playbooks and roles",
    slug: "ansible-inventory-playbooks-roles",
    lesson: {
      summary: "Configure servers over SSH with an inventory of hosts, playbooks of tasks and reusable roles, written so that re-running them is safe.",
      minutes: 9,
      blocks: [
        { type: "h2", text: "What Ansible does" },
        { type: "p", text: "Ansible configures machines that already exist: install packages, write config files, start services, create users. It is **agentless**. The control machine connects over SSH, runs small modules on the target, and disconnects. Nothing needs to be installed on the servers except Python and an SSH user." },
        { type: "h2", text: "Inventory" },
        { type: "p", text: "The inventory lists the hosts and groups them. Groups let you target a whole tier at once and attach variables to it." },
        {
          type: "code",
          language: "ini",
          title: "inventory.ini",
          code: `[web]
web1 ansible_host=203.0.113.20
web2 ansible_host=203.0.113.21

[db]
db1 ansible_host=10.0.2.15

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/myapp.pem`,
        },
        { type: "p", text: "For cloud servers whose IPs change, a dynamic inventory plugin such as `amazon.aws.aws_ec2` builds the list from the API, grouped by tags." },
        { type: "h2", text: "Playbooks" },
        { type: "p", text: "A playbook is a YAML file. Each **play** maps a group of hosts to a list of **tasks**, and each task calls a module with arguments." },
        {
          type: "code",
          language: "yaml",
          title: "web.yml",
          code: `- name: Configure web servers
  hosts: web
  become: true
  vars:
    app_port: 3000
  tasks:
    - name: Install nginx
      ansible.builtin.apt:
        name: nginx
        state: present
        update_cache: true

    - name: Write site config
      ansible.builtin.template:
        src: site.conf.j2
        dest: /etc/nginx/conf.d/site.conf
        mode: "0644"
      notify: Reload nginx

    - name: Make sure nginx runs at boot
      ansible.builtin.service:
        name: nginx
        state: started
        enabled: true

  handlers:
    - name: Reload nginx
      ansible.builtin.service:
        name: nginx
        state: reloaded`,
        },
        {
          type: "code",
          language: "bash",
          code: `ansible all -i inventory.ini -m ping
ansible-playbook -i inventory.ini web.yml --check --diff   # dry run
ansible-playbook -i inventory.ini web.yml`,
        },
        { type: "p", text: "`become: true` runs tasks with sudo. A **handler** runs only when a task that notifies it actually changed something, and at most once at the end of the play." },
        { type: "h2", text: "Idempotency" },
        { type: "p", text: "A good playbook can run ten times and only change things the first time. Modules like `apt`, `template` and `service` describe a desired state (`present`, `started`) and do nothing when it already holds. The run summary reports `ok` for untouched tasks and `changed` for ones that acted." },
        { type: "callout", tone: "gotcha", title: "`command` and `shell` are not idempotent", text: "They run every time and always report `changed`. Prefer a real module. If you must use them, add `creates:` or `when:` so they skip when the result already exists, or `changed_when:` to report honestly." },
        { type: "h2", text: "Roles" },
        { type: "p", text: "When a playbook grows, move related pieces into a **role**: a folder with a fixed layout that Ansible knows how to load." },
        {
          type: "code",
          language: "text",
          code: `roles/nginx/
  tasks/main.yml        # the task list
  handlers/main.yml
  templates/site.conf.j2
  defaults/main.yml     # lowest-priority variables, easy to override
# then in a playbook:
#   roles:
#     - nginx`,
        },
        { type: "p", text: "A web tier and a database tier then become two plays, each applying its own roles to its own group. The same `nginx` role can be reused in other projects, and tuned through variables." },
        { type: "callout", tone: "tip", title: "Use check mode and keep secrets encrypted", text: "`--check --diff` previews changes before they happen. Store passwords and keys with `ansible-vault` or a secrets manager, not in plain variable files." },
      ],
      references: [
        { title: "How to build your inventory (Ansible documentation)", url: "https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html" },
        { title: "Ansible playbooks (Ansible documentation)", url: "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html" },
        { title: "Roles (Ansible documentation)", url: "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html" },
        { title: "ansible.builtin.apt module", url: "https://docs.ansible.com/ansible/latest/collections/ansible/builtin/apt_module.html" },
      ],
    },
  },
};
