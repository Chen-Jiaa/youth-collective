# Classes page handoff

## Purpose and route

The public Classes page is a dynamic, server-rendered Learning Labs timetable. It uses live database data and supports session-level booking and waitlisting.

- Public route and page: [app/classes/page.tsx](./app/classes/page.tsx)
- Loading state: [app/classes/loading.tsx](./app/classes/loading.tsx)
- Shared page shell: [Navbar](./app/components/Navbar.tsx), [Container](./app/components/Container.tsx), and [Footer](./app/components/Footer.tsx)

## Current page structure

```text
Navbar
└─ Main
   ├─ Hero
   │  ├─ “Learning Labs: Classes”
   │  ├─ Introductory copy
   │  └─ Signed-in account panel (authenticated visitors only)
   ├─ “What we do?”
   │  ├─ Eat Together
   │  └─ Learn Together
   └─ “Join a class”
      ├─ Optional welcome-back email
      ├─ “My Classes” → /dashboard
      ├─ Day filter
      ├─ Audience filter
      └─ Course cards
         └─ Bookable session rows
            ├─ Audience label
            ├─ Session title
            ├─ Date, time, and location
            ├─ Booking/waitlist button
            └─ Remaining-capacity label
Footer
```

The canonical rendered copy and layout are in [app/classes/page.tsx](./app/classes/page.tsx).

## Published copy

### Hero

- **Heading:** `Learning Labs: Classes`
- **Description:** `A few hours where we dive into the deeper questions of God, relationship, and life.`

### What we do?

- **Eat Together:** Members gather around a table to eat and talk. Sometimes some members cook; most often they get food together.
- **Learn Together:** Members practise a way of Jesus, discuss it in small groups after trying it, and sometimes pair with people unlike themselves. Groups stay consistent across the classes.

## Current live timetable

Data checked on **2 September 2026**. The page currently has one public Course:

- **Course:** `Learning Labs: Classes - Knowing God`
- **Course summary:** `A four-part Conversation with God class.`

Every published session is in **Upper Room**, capacity **30**, with **0 confirmed bookings**. Times below are Kuala Lumpur time.

| Session | Audience | Date and time |
| --- | --- | --- |
| Knowing God: Who He is | College/Uni — Sundays | Sun 4 Oct 2026, 1:00–3:00pm |
| Knowing God: Who He is | College/Uni — Fridays | Fri 9 Oct 2026, 8:30–10:30pm |
| Knowing God: Who He is | Teens — Sundays | Sun 11 Oct 2026, 1:30–3:30pm |
| Knowing God: Through Scripture | College/Uni — Sundays | Sun 18 Oct 2026, 1:00–3:00pm |
| Knowing God: Through Scripture | College/Uni — Fridays | Fri 23 Oct 2026, 8:30–10:30pm |
| Knowing God: Through Scripture | Teens — Sundays | Sun 25 Oct 2026, 1:30–3:30pm |
| Knowing God: Through Prayer | College/Uni — Sundays | Sun 1 Nov 2026, 1:00–3:00pm |
| Knowing God: Through Prayer | College/Uni — Fridays | Fri 6 Nov 2026, 8:30–10:30pm |
| Knowing God: Through Prayer | Teens — Sundays | Sun 8 Nov 2026, 1:30–3:30pm |

The [Conversation with God series plan](./.context/plans/add-the-conversation-with-god-class-series.md) calls for a four-part, 12-session series, including sessions on 15, 20, and 22 November. Those final three sessions are not in the current public data.

## Domain model

Canonical terminology: [CONTEXT.md](./CONTEXT.md).

```text
Course
└─ Class (audience-specific offering)
   └─ Session (dated, individually bookable occurrence)
      ├─ Booking
      └─ Waitlist entry
```

- A **Course** is a reusable learning journey.
- A **Class** is an audience-specific offering within a Course.
- A **Session** is a dated, individually bookable meeting of a Class.
- A visitor books a **Session**, never a Course or Class.

The public page renders Course name/description as the outer group, Class audience as the session label, and a Session display name as the title.

Related implementation and plans:

- [Database schema](./lib/db/schema.ts)
- [Public session query and `PublicSession` type](./lib/db/repositories/sessions.ts)
- [Session display-name rules](./lib/db/repositories/session-display-name.ts)
- [Kuala Lumpur timezone helpers](./lib/session-time.ts)
- [Course → Class → Session hierarchy plan](./.context/plans/course-class-session-hierarchy.md)

## What appears publicly

The query in [sessions.ts](./lib/db/repositories/sessions.ts) returns only Sessions that are:

- scheduled;
- in the future;
- attached to a non-archived Class; and
- attached to a non-archived Course.

For each row it returns Course/Class context, audience, location, times, and places left. Availability subtracts confirmed bookings from Session capacity.

Session titles resolve as:

1. `sessions.displayName`, when set;
2. the Class name for a non-recurring Session; or
3. the Class name plus a chronological series number for a recurring Session.

## UI and filters

The page uses warm off-white surfaces (`#f6f5f0`), charcoal text/controls (`#292823`), white cards, a muted purple interaction accent (`#5c578b`), Archivo Black display type, and Inter body/UI type.

Global type and styling definitions:

- [app/layout.tsx](./app/layout.tsx)
- [app/globals.css](./app/globals.css)

[ScheduleList](./app/classes/ScheduleList.tsx) is a client component with two client-side filters:

- **Day:** session-start day in `Asia/Kuala_Lumpur`.
- **Audience:** text before ` — `. Thus `College/Uni — Fridays` and `College/Uni — Sundays` both filter under `College/Uni`.

It provides empty states for no upcoming sessions and no filter matches.

### Important implementation caveat

Course grouping assumes every Course’s sessions remain consecutive after chronological sorting. If Session dates from Course A and Course B interleave, Course A can render as multiple cards. This is not currently visible because live data contains only one Course.

## Authentication and booking

Primary files:

- [BookingControl](./app/classes/BookingControl.tsx)
- [Booking server actions](./lib/bookings/actions.ts)
- [Atomic booking/waitlist commands](./lib/db/repositories/booking-commands.ts)
- [Member booking query](./lib/db/repositories/bookings.ts)
- [Account panel](./app/classes/AccountControl.tsx)
- [Member dashboard](./app/dashboard/page.tsx)

Behaviour:

- Available Session → **Join this class**.
- Full Session → **Join waitlist**.
- Confirmed booking → **You’re In** plus **Cancel booking**.
- No login or no Person profile → redirect to `/dashboard?next=/classes`.
- In-page actions show an inline status message and refresh the route.
- `?booking=confirmed` renders a page-level confirmation banner.
- Cancellation is allowed only for a future confirmed booking and atomically promotes the earliest waitlisted person.

Booking, waitlist, promotion, and cancellation notifications are queued after the database transaction. Setup is documented in [README.md](./README.md).

## Admin content management

Administrators manage Courses and Classes at `/admin/classes`.

- [Admin Courses & Classes page](./app/admin/classes/page.tsx)
- [Course management UI](./app/admin/CoursesPanel.tsx)
- [Class management UI](./app/admin/ClassesPanel.tsx)
- [Admin list queries and types](./lib/db/repositories/admin.ts)
- [Admin server actions](./lib/admin/actions.ts)
- [Admin authorization](./lib/admin/authorization.ts)

Admin capabilities:

- Create, edit, archive, and restore Courses.
- Edit/archive Classes, including name, audience, and description.
- Apply one location to all upcoming scheduled Sessions in a Class.
- Create Sessions, Classes, and Courses through the Sessions workflow.
- Edit a Session’s schedule, capacity, location, display name, status, and check-in window.

Archiving either a Course or a Class hides its future Sessions publicly while retaining records. Admin mutations revalidate `/classes` and `/dashboard`.

## Change checklist

Before making a change, verify:

1. Whether it affects a Course, Class, or Session—the terms are not interchangeable.
2. That booking rules stay Session-scoped.
3. That date parsing/formatting stays in `Asia/Kuala_Lumpur`.
4. That archived Courses/Classes remain hidden publicly.
5. Whether dashboard and admin views also require updates.
6. Whether the multi-Course grouping caveat needs resolution.
7. Whether the three missing planned Conversation with God sessions should be created, or the plan/content should be updated.
