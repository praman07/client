import { BarChart, Globe, Layers, Shield, Users, Zap } from 'lucide-react'

export function MarketingFeatures() {
  const features = [
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: 'Lightning Fast',
      description:
        'Built with performance in mind. Experience sub-millisecond updates and real-time collaboration without lag.',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: 'Enterprise Security',
      description:
        'Bank-grade encryption, role-based access control, and compliant with SOC2 and GDPR. Your data is safe.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Real-time Collaboration',
      description:
        'Work together in real-time. See cursors, live typing, and instant updates across all your devices.',
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: 'Seamless Integration',
      description:
        'Connect with your favorite tools. Jira, GitHub, Slack, and more. All seamlessly integrated into one workflow.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-primary" />,
      title: 'Meaningful Insights',
      description:
        'Track progress, velocity, and team health with beautiful, actionable dashboards and reports.',
    },
    {
      icon: <Globe className="h-10 w-10 text-primary" />,
      title: 'Global Scale',
      description:
        'Deployed on edge networks worldwide. collaborating with teammates across the globe feels like they are next door.',
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to deliver
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
            Collabify provides the essential tools to help your team build
            better products, faster.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-start space-y-4 p-8 border rounded-2xl bg-background hover:shadow-lg transition-shadow"
            >
              <div className="p-3 bg-primary/10 rounded-xl">{feature.icon}</div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
