'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EventsCommunity() {
  const events = [
    {
      id: 1,
      title: "Networking Night",
      date: "2025-12-15",
      time: "6:00 PM - 8:00 PM",
      link: "/events/networking-night",
    },
    {
      id: 2,
      title: "React Workshop",
      date: "2025-12-22",
      time: "2:00 PM - 5:00 PM",
      link: "/events/react-workshop",
    },
    {
      id: 3,
      title: "Community Meetup",
      date: "2026-01-05",
      time: "5:30 PM - 7:30 PM",
      link: "/events/community-meetup",
    },
  ]

  return (
    <section id="events" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto animate-fade-in">
        {/* Overview */}
        <h2 className="text-4xl font-extrabold text-center mb-6 text-black">
          Events & Community
        </h2>
        <p className="text-center text-black/70 mb-12 max-w-2xl mx-auto text-base">
          We host regular events to help members learn, grow, and build valuable connections.
          Enjoy workshops, networking nights, training sessions, and community meetups.
        </p>

        {/* Upcoming Events */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-black mb-6 text-center">Upcoming Events</h3>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {events.map((event) => (
              <Card
                key={event.id}
                className="border-golden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-black">{event.title}</CardTitle>
                  <CardDescription className="text-black/70">
                    {event.date} • {event.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href={event.link}>
                    <Button className="bg-golden text-black hover:bg-golden/90">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-black mb-6">
            Ready to see your new workspace?
          </h3>
          <Link href="/booking">
            <Button className="bg-golden text-black px-8 py-3 rounded-full hover:bg-golden/90">
              Book a Tour
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
