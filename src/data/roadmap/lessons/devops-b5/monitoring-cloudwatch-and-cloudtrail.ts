import type { LessonEntry } from "@/types/roadmap";

export const MONITORING_CLOUDWATCH_AND_CLOUDTRAIL: LessonEntry = {
  track: "devops",
  section: "Cloud (AWS)",
  subsection: {
    title: "Monitoring: CloudWatch logs and alarms, and CloudTrail",
    slug: "monitoring-cloudwatch-and-cloudtrail",
    lesson: {
      summary: "See what your app is doing with CloudWatch metrics, logs and alarms, and see who changed your account with CloudTrail.",
      minutes: 8,
      blocks: [
        { type: "h2", text: "Two services, two questions" },
        { type: "p", text: "**CloudWatch** answers \"how is my system behaving?\" with metrics, logs and alarms. **CloudTrail** answers \"who did what in my AWS account?\" by recording API calls. You need both: one for outages, the other for incidents, audits and the question \"who deleted that security group?\"" },
        { type: "h2", text: "CloudWatch metrics and logs" },
        { type: "p", text: "Most AWS services publish **metrics** for free or cheaply: ECS service CPU and memory, ALB request counts and 5xx errors, RDS connections and free storage. Metrics are numbers over time, grouped by namespace and dimensions such as the service name." },
        { type: "p", text: "**Logs** live in **log groups** (usually one per app) containing **log streams** (usually one per task or instance). ECS and Lambda can send container output there. Write structured JSON lines so you can filter fields in **Logs Insights**." },
        {
          type: "code",
          language: "bash",
          code: `aws logs put-retention-policy --log-group-name /ecs/myapp-api --retention-in-days 30
aws logs tail /ecs/myapp-api --follow --since 10m
aws logs start-query --log-group-name /ecs/myapp-api \\
  --start-time $(( $(date +%s) - 3600 )) --end-time $(date +%s) \\
  --query-string 'fields @timestamp, @message | filter @message like /ERROR/ | limit 20'`,
        },
        { type: "callout", tone: "cost", title: "Set retention on day one", text: "A new log group keeps logs forever by default, and you pay for every stored GB. Set a retention of 14 to 30 days for app logs. Ingestion is also billed, so a debug-level log in a hot loop is a bill, not just noise." },
        { type: "h2", text: "Alarms" },
        { type: "p", text: "An **alarm** watches one metric and moves between `OK`, `ALARM` and `INSUFFICIENT_DATA`. You define a statistic, a period, a threshold and how many periods must breach before it fires. On a state change it can notify an **SNS topic**, which emails or pages you." },
        {
          type: "code",
          language: "bash",
          code: `aws sns create-topic --name myapp-alerts
aws sns subscribe --topic-arn arn:aws:sns:ap-south-1:111122223333:myapp-alerts \\
  --protocol email --notification-endpoint you@example.com

aws cloudwatch put-metric-alarm --alarm-name myapp-cpu-high \\
  --namespace AWS/ECS --metric-name CPUUtilization \\
  --dimensions Name=ClusterName,Value=myapp Name=ServiceName,Value=api \\
  --statistic Average --period 300 --evaluation-periods 2 \\
  --threshold 80 --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:ap-south-1:111122223333:myapp-alerts`,
        },
        { type: "p", text: "Good first alarms: ALB 5xx count, target group unhealthy hosts, ECS CPU and memory, RDS free storage and connections. Alarm on symptoms users feel before low-level causes, and confirm the email subscription, which must be clicked before any alert arrives." },
        { type: "h2", text: "CloudTrail" },
        { type: "p", text: "CloudTrail records **management events** (creating an instance, changing an IAM policy, deleting a bucket) with who, when, from which IP and with what result. The last 90 days of management events are viewable in **Event history** with no setup. To keep them longer, or to include data events such as S3 object reads, create a **trail** that delivers to an S3 bucket." },
        {
          type: "code",
          language: "bash",
          code: `aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteSecurityGroup \\
  --max-results 5`,
        },
        { type: "callout", tone: "tip", title: "Protect the trail", text: "Send the trail to a separate bucket, turn on log file validation, and restrict who can delete it. An attacker's first move is often to switch logging off." },
      ],
      references: [
        { title: "What is Amazon CloudWatch?", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html" },
        { title: "Using Amazon CloudWatch alarms", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html" },
        { title: "What is Amazon CloudWatch Logs?", url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html" },
        { title: "What Is AWS CloudTrail?", url: "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html" },
      ],
    },
    points: [
      {
        id: "devops.monitoring-cloudwatch-and-cloudtrail.log-retention",
        title: "Set log retention",
        detail: "CloudWatch log groups keep data forever unless you set a retention period, and stored and ingested data are both billed. Choose a retention such as 30 days when you create the group.",
        question: "What happens to your bill if you never set a retention policy on a chatty app's log group?",
      },
      {
        id: "devops.monitoring-cloudwatch-and-cloudtrail.alarm-states",
        title: "Alarms and SNS notifications",
        detail: "An alarm evaluates one metric over periods and moves between OK, ALARM and INSUFFICIENT_DATA. An SNS topic delivers the notification, and an email subscription only works once confirmed.",
        question: "Why might an alarm fire in the console but never email you?",
      },
      {
        id: "devops.monitoring-cloudwatch-and-cloudtrail.cloudtrail-audit",
        title: "CloudTrail answers who did what",
        detail: "CloudTrail records API calls with the caller, time, source IP and result. Event history covers 90 days of management events, and a trail to S3 keeps them longer and can include data events.",
        question: "A security group disappeared. Where do you look to find out who deleted it?",
      },
    ],
  },
};
