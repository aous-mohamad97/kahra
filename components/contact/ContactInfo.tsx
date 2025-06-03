"use client"; // Keep if it uses client-side features like Lucide directly

import { MapPin, Phone, Mail, Clock } from "lucide-react";

interface ContactInfoProps {
  title?: string | null;
  officeTitle?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  officeHoursRaw?: string | null; // Raw text, lines separated by newline
}

export default function ContactInfo({
  title = "Contact Information",
  officeTitle = "Our Office",
  address,
  phone,
  email,
  officeHoursRaw,
}: ContactInfoProps) {
  const officeHoursArray = officeHoursRaw
    ?.split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8 tracking-wider uppercase">
        {title}
      </h2>
      <div className="space-y-8">
        <div className="bg-secondary p-8 rounded-lg">
          {officeTitle && (
            <h3 className="text-xl font-bold mb-6 tracking-wider uppercase">
              {officeTitle}
            </h3>
          )}
          <div className="space-y-6">
            {address && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <div className="font-light text-muted-foreground">
                  {address.split("\n").map(
                    (
                      line,
                      index // Split address by newline too
                    ) => (
                      <p key={index}>{line.trim()}</p>
                    )
                  )}
                </div>
              </div>
            )}
            {phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                <p className="font-light text-muted-foreground">{phone}</p>
              </div>
            )}
            {email && (
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="font-light text-muted-foreground hover:text-accent transition-colors"
                >
                  {email}
                </a>
              </div>
            )}
            {officeHoursArray && officeHoursArray.length > 0 && (
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-accent mr-3 mt-1 flex-shrink-0" />
                <div className="font-light text-muted-foreground">
                  {officeHoursArray.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
