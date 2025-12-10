'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '500+', label: 'Happy Members' },
  { value: '24/7', label: 'Access' },
  { value: '100%', label: 'Satisfaction' },
];

const team = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    bio: 'Passionate about creating spaces that inspire innovation and collaboration.',
    emoji: '👨‍💼',
  },
  {
    name: 'Sarah Chen',
    role: 'Community Manager',
    bio: 'Dedicated to building meaningful connections between our members.',
    emoji: '👩‍💻',
  },
  {
    name: 'Jamal Williams',
    role: 'Operations Lead',
    bio: 'Ensuring everything runs smoothly so you can focus on what matters most.',
    emoji: '⚙️',
  },
];

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1 
          className="text-4xl sm:text-5xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our <span className="text-yellow-600">Story</span>
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          We started with a simple idea: create workspaces that people love. Today, we're proud to be a vibrant community of professionals, creatives, and entrepreneurs.
        </motion.p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
        {stats.map((stat, index) => (
          <motion.div 
            key={stat.label}
            className="bg-background p-6 rounded-xl text-center border border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Mission Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <motion.div 
          className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-2xl border border-yellow-100 dark:border-yellow-900/30"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            To create workspaces that inspire productivity, foster community, and support the evolving needs of modern professionals. We believe that where you work matters, and we're committed to providing environments that help you do your best work.
          </p>
          <div className="h-1 w-20 bg-yellow-600 rounded-full mb-6"></div>
          <h3 className="text-lg font-medium text-foreground mb-3">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {['Community', 'Innovation', 'Sustainability'].map((value) => (
              <div key={value} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                <span className="text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-12">Meet the Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div 
              key={member.name}
              className="bg-background p-6 rounded-xl border border-border/30 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="text-4xl mb-4">{member.emoji}</div>
              <h3 className="text-lg font-medium text-foreground">{member.name}</h3>
              <p className="text-yellow-600 text-sm mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div 
        className="mt-20 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to join our community?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Experience the difference of working in a space designed for success. Book a tour today and see for yourself.
        </p>
        <a
          href="/booking"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-yellow-600 hover:bg-yellow-700 transition-colors"
        >
          Book a Tour →
        </a>
      </motion.div>
    </section>
  );
}