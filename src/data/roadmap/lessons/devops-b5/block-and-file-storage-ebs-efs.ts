import type { LessonEntry } from "@/types/roadmap";

export const BLOCK_AND_FILE_STORAGE_EBS_EFS: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Block and file storage: EBS and EFS",
    slug: "block-and-file-storage-ebs-efs",
    lesson: {
      summary: "Choose between a disk for one instance (EBS) and a shared network filesystem (EFS), and avoid paying for forgotten volumes.",
      minutes: 7,
      blocks: [
        { type: "h2", text: "Three kinds of storage, three shapes" },
        { type: "table", head: ["", "EBS", "EFS", "S3"], rows: [["Type", "Block device (a disk)", "Network filesystem (NFS)", "Object store (HTTP API)"], ["Attached to", "One instance, in one AZ", "Many instances, across AZs", "Nothing; accessed over the API"], ["Mounted as", "`/dev/...`, you format it", "A directory, ready to use", "Not mounted"], ["Billing", "Provisioned GB", "GB actually stored", "GB actually stored"]] },
        { type: "p", text: "**EBS** (Elastic Block Store) is the disk behind an EC2 instance: the root volume and any extra volumes. It behaves like a local drive, with low latency, and you format it with a filesystem yourself. A volume exists in one availability zone and attaches to instances in that zone. Newer general-purpose `gp3` volumes let you set size, IOPS and throughput independently." },
        { type: "p", text: "**EFS** (Elastic File System) is a shared filesystem many servers or containers mount at the same time, which grows and shrinks as you add files. It is slower per operation than a local disk, and it costs noticeably more per GB than EBS, so it suits shared content, not databases." },
        { type: "h2", text: "Using an extra EBS volume" },
        {
          type: "code",
          language: "bash",
          code: `aws ec2 create-volume --volume-type gp3 --size 20 \\
  --availability-zone ap-south-1a --encrypted
aws ec2 attach-volume --volume-id vol-0abc123 \\
  --instance-id i-0abc123 --device /dev/sdf

# on the instance
lsblk                                  # find the new device, often nvme1n1
sudo mkfs -t xfs /dev/nvme1n1          # only the FIRST time: this erases the disk
sudo mkdir /data && sudo mount /dev/nvme1n1 /data`,
        },
        { type: "p", text: "To make the mount survive a reboot, add it to `/etc/fstab` using the volume's UUID from `blkid`, not the device name, which can change." },
        { type: "h2", text: "Snapshots" },
        { type: "p", text: "An EBS **snapshot** is a point-in-time backup stored by AWS. The first one copies the whole volume's used data and later ones store only changed blocks. You can create a new volume from a snapshot, even in another AZ or region after copying it. Automate them with Data Lifecycle Manager or AWS Backup rather than remembering to run a command." },
        { type: "h2", text: "When to use which" },
        { type: "list", items: ["**One server, one disk**: EBS. Database data directories, build caches, anything needing fast local I/O.", "**Several servers need the same files**: EFS. Shared uploads for a legacy app, CMS media, ML datasets. ECS tasks on Fargate can mount it too.", "**Plain files accessed by an app**: usually S3 is cheaper and simpler than either. Prefer it for uploads and backups.", "**A managed database**: let RDS own the disk instead of putting a database on EBS by hand."] },
        { type: "callout", tone: "cost", title: "Orphaned volumes and snapshots", text: "The root volume is deleted when you terminate the instance by default, but extra volumes you attach are kept unless you ticked delete-on-termination. A detached volume keeps billing every hour, and so do snapshots. After tearing down a lab, list volumes with state `available` and delete the ones you do not need." },
        { type: "callout", tone: "gotcha", title: "EBS is single-AZ", text: "If the availability zone goes down, the volume is unreachable with it. A snapshot copy, or an architecture that does not depend on one volume, is your protection." },
      ],
      references: [
        { title: "What is Amazon Elastic Block Store?", url: "https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html" },
        { title: "Amazon EBS snapshots", url: "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html" },
        { title: "What is Amazon Elastic File System?", url: "https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html" },
      ],
    },
    points: [
      {
        id: "devops.block-and-file-storage-ebs-efs.ebs-single-az",
        title: "EBS is one disk in one zone",
        detail: "An EBS volume attaches to an instance in its own availability zone, so it is lost to you if that zone fails. Snapshots are the backup you can restore elsewhere.",
        question: "How do you move data on an EBS volume to an instance in a different availability zone?",
      },
      {
        id: "devops.block-and-file-storage-ebs-efs.efs-shared",
        title: "EFS is shared and elastic",
        detail: "EFS is an NFS filesystem that many instances or tasks mount at once, and it grows with what you store. It costs more per GB than EBS and has higher latency, so use it only when sharing is the requirement.",
        question: "Which storage would you pick for three web servers that must see the same uploaded files?",
      },
      {
        id: "devops.block-and-file-storage-ebs-efs.orphaned-volumes",
        title: "Clean up detached volumes",
        detail: "Extra EBS volumes can outlive their instance and keep billing while detached. Snapshots bill too, so list volumes in the available state and old snapshots after every teardown.",
        question: "What command or filter would you use to find volumes nothing is attached to?",
      },
    ],
  },
};
