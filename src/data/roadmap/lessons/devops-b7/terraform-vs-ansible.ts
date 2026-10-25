import type { LessonEntry } from "@/types/roadmap";

export const TERRAFORM_VS_ANSIBLE: LessonEntry = {
  track: "devops",
  section: "Infrastructure as code and GitOps",
  subsection: {
    title: "Terraform vs Ansible",
    slug: "terraform-vs-ansible",
    lesson: {
      summary: "Terraform creates infrastructure and tracks it in state, Ansible configures what runs on machines, and many teams use both.",
      minutes: 6,
      blocks: [
        { type: "h2", text: "Different jobs" },
        { type: "p", text: "The two tools overlap a little, which causes the usual \"which one?\" argument. The practical split is simple. **Terraform provisions**: networks, instances, databases, load balancers, DNS. **Ansible configures**: packages, config files, users, services on a machine that already exists." },
        { type: "table", head: ["", "Terraform", "Ansible"], rows: [["Main job", "Create and change cloud resources", "Configure software on hosts"], ["Style", "Declarative: describe the end state", "Procedural tasks, written to be idempotent"], ["Memory", "Keeps a **state** file of what it created", "No state file; checks the host each run"], ["Connects via", "Provider APIs (AWS, Cloudflare, ...)", "SSH (or WinRM), no agent on the host"], ["Removal", "Knows what to delete from state", "Does not know what it no longer lists"], ["Language", "HCL", "YAML playbooks"]] },
        { type: "h2", text: "Why state is the dividing line" },
        { type: "p", text: "Terraform can destroy a server because its state says it created one and your code no longer lists it. Ansible has no such record. If you delete a task that installed a package, the package stays on the machine. That makes Ansible a poor fit for tearing infrastructure down, and Terraform a poor fit for managing the contents of a server's files." },
        { type: "h2", text: "Using them together" },
        { type: "p", text: "A common flow is Terraform first, Ansible second. Terraform builds the VPC and instance and prints the public IP as an output. That output feeds an Ansible inventory, and a playbook installs and configures the software." },
        {
          type: "code",
          language: "bash",
          code: `terraform apply
IP=$(terraform output -raw instance_ip)
ansible-playbook -i "$IP," -u ubuntu --private-key ~/.ssh/myapp.pem web.yml`,
        },
        { type: "p", text: "The trailing comma makes Ansible treat the argument as an inline host list instead of a file name. For anything bigger, use the AWS dynamic inventory plugin to select hosts by tag." },
        { type: "callout", tone: "gotcha", title: "Do not configure inside Terraform", text: "Provisioners such as `remote-exec` can run scripts on a new instance, but Terraform's own documentation treats them as a last resort. A failed script leaves a half-built resource, and Terraform cannot plan changes to it. Use user data, a baked image, or Ansible." },
        { type: "h2", text: "When you need less of one" },
        { type: "list", items: ["With **containers and Kubernetes**, servers run little beyond a container runtime, so there is far less to configure. Terraform plus a Dockerfile may be enough.", "With **machine images** (baked with Packer, for example), configuration happens at build time and instances are replaced instead of patched.", "For a **small fleet of long-lived VMs**, Ansible does real work: OS updates, users, nginx, certificates."] },
        { type: "p", text: "Terraform also handles some configuration, and Ansible has cloud modules that can create instances. You can force either to do the other job, but you will fight the tool. Pick based on whether you are creating a resource or changing what is inside one." },
      ],
      references: [
        { title: "What is Terraform? (HashiCorp Terraform documentation)", url: "https://developer.hashicorp.com/terraform/intro" },
        { title: "Ansible playbooks (Ansible documentation)", url: "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html" },
        { title: "State (Terraform language documentation)", url: "https://developer.hashicorp.com/terraform/language/state" },
      ],
    },
  },
};
