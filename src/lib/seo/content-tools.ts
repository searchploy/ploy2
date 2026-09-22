import { SEO_PAGES } from "@/lib/seo/pages";
import type { SeoContent } from "@/lib/seo/content-types";

/**
 * Group B — the "AI tools for X" pages. These are category roundups: what the
 * category covers, which parts of the work it fits, and how to compare options.
 * The matching "AI employee" page goes deeper on one product shape; the
 * matching "AI for X" page goes deeper on one workflow.
 */

const homeCrumb = { label: "Home", href: "/" };
const toolsCrumb = { label: "AI Tools", href: SEO_PAGES.toolsHub.path };

export const toolsHubContent: SeoContent = {
  eyebrow: "AI Tools",
  heading: "AI Tools for Your Business",
  intro:
    "An AI tool is any AI-powered product that takes on part of how your business runs. Ploy groups them by the problem they solve rather than the technology behind them, so you can compare options against the work you actually want off your plate.",
  trail: [homeCrumb, { label: "AI Tools", href: SEO_PAGES.toolsHub.path }],
  cta: { label: "Browse AI tools", href: "/marketplace" },
  sections: [
    {
      kind: "prose",
      id: "what-counts",
      title: "What Counts as an AI Tool",
      lead: [
        "The market has produced a lot of words for roughly the same thing. AI agents, AI employees, AI assistants, AI automations, copilots, workflows — the labels track marketing fashion more closely than they track any real difference in what the software does.",
        "Ploy treats all of them as AI tools. Some run a standing role and are reasonably described as AI employees. Some fire on a trigger and are better described as automations. Some sit inside a product you already pay for. The distinction that matters to a buyer is not which noun a vendor chose, but what the thing does, what it connects to, and what it costs to run.",
      ],
    },
    {
      kind: "tasks",
      id: "categories",
      title: "Where AI Tools Are Used",
      lead: ["The areas where businesses most often find something worth paying for:"],
      items: [
        {
          title: "Sales",
          body: "Lead research, outreach drafting, follow-up sequences, appointment setting and keeping the CRM current. The gains come from consistency rather than cleverness.",
        },
        {
          title: "Marketing",
          body: "Content drafting, social scheduling, keyword and competitor research, and campaign reporting. Output is a first draft; the editing pass stays yours.",
        },
        {
          title: "Customer service",
          body: "Answering repeat questions, triaging and routing tickets, and covering the hours you cannot staff. Escalation behaviour is the thing to scrutinise.",
        },
        {
          title: "Recruiting",
          body: "Sourcing, screening support, interview scheduling and candidate communication — with hiring decisions left with a person who can explain them.",
        },
        {
          title: "Admin and operations",
          body: "Data entry, document reading, moving information between systems, and the recurring reports nobody wants to rebuild by hand each week.",
        },
        {
          title: "Finance and reporting",
          body: "Invoice and receipt processing, reconciliation support, and pulling numbers into a recurring summary with the changes worth noticing flagged.",
        },
      ],
    },
    {
      kind: "steps",
      id: "choosing",
      title: "How to Choose an AI Tool",
      lead: [
        "Most disappointing purchases come from picking a category first and a problem second. Reverse that order:",
      ],
      items: [
        {
          title: "Start from a task, not a technology",
          body: "Name the specific work you want handled and roughly how much of it there is each week. A task with real volume and a clear definition of done is a good candidate. One that changes shape every time is not.",
        },
        {
          title: "Check what it connects to",
          body: "A tool that cannot reach your CRM, help desk, calendar or mailbox will create copy-paste work rather than remove it. Integrations are usually the constraint, not model quality.",
        },
        {
          title: "Decide where a person stays in the loop",
          body: "Anything customer-facing, financial or legally consequential should route to a human by default. Settle this before launch rather than after an incident.",
        },
        {
          title: "Price it against the volume you actually have",
          body: "Per-message and per-conversation pricing behaves very differently at ten a day and a thousand. Ask what the bill looks like at your real numbers.",
        },
        {
          title: "Run it narrow first",
          body: "One workflow, one team, a few weeks, with someone reviewing output. A small deployment tells you more than a long evaluation call.",
        },
      ],
    },
    {
      kind: "checks",
      id: "questions",
      title: "Questions Worth Asking Any Provider",
      items: [
        "What exactly does it do without a human involved, and what always needs approval?",
        "Which systems does it integrate with today — not on a roadmap?",
        "Where does its information come from, and can it show sources for claims it makes?",
        "What happens when it does not know something? Escalating is the answer you want.",
        "Who owns the output and any data you put in, and is your data used to train anything?",
        "How is it priced as volume grows, and what does a realistic month cost?",
        "Can you export a record of what it did, and correct it after the fact?",
      ],
      footnote:
        "Listings on Ploy are published by independent providers. Ploy does not build, resell or support them, and capability claims are the provider's own — confirm them directly before committing.",
    },
  ],
  faqs: [
    {
      question: "What is the difference between an AI tool and an AI employee?",
      answer:
        "An AI employee is a kind of AI tool — one built to run an ongoing role rather than a single task, usually connected to your systems and working continuously. Ploy lists both under AI tools because the useful comparison is what a product does, not which label its vendor picked.",
    },
    {
      question: "How much do AI tools cost?",
      answer:
        "Pricing varies widely by provider and model — flat monthly fees, per-seat, per-conversation and usage-based pricing are all common. Because the same tool can cost very differently at different volumes, ask any provider what a month looks like at your actual numbers rather than relying on a headline price.",
    },
    {
      question: "Do I need technical skills to use an AI tool?",
      answer:
        "It depends on the product. Some are configured entirely through a web interface; others need someone comfortable connecting APIs or mapping fields between systems. The integration work is usually the part that requires help, which is why some businesses bring in a consultant for setup.",
    },
    {
      question: "Which AI tool should a business start with?",
      answer:
        "Usually the one attached to the highest-volume, best-defined task you have — often scheduling, first-line support or follow-up. Starting where the work is repetitive and the cost of a mistake is low gives you a real result to judge before committing to anything larger.",
    },
  ],
  listing: {
    title: "AI Tools on Ploy",
    emptyBody: "No listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace",
    browseLabel: "Browse the marketplace",
  },
  related: {
    keys: ["hub", "toolsSmallBusiness", "toolsSales", "toolsCustomerService"],
    blurbs: {
      hub: "AI employees are one type of AI tool — what that shape means in practice.",
      toolsSmallBusiness: "Where to start when you have no dedicated team for any of this.",
      toolsSales: "AI tools that fit around a sales process.",
      toolsCustomerService: "AI tools for support queues and response times.",
    },
  },
  closing: {
    title: "Find AI Tools for Your Business",
    body: "Browse the marketplace by the problem you are trying to solve, or answer a few questions and get a free AI Report with recommendations matched to how your business actually works.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse AI tools", href: "/marketplace" },
  },
};

export const toolsSmallBusinessContent: SeoContent = {
  eyebrow: "Small Business",
  heading: "AI Tools for Small Business",
  intro:
    "Small businesses rarely have a spare person to absorb overflow work, which is what makes AI tools appealing and also what makes a bad choice expensive. This covers where the time actually goes back, what to budget, and how to pick a first tool without a large rollout.",
  trail: [homeCrumb, toolsCrumb, { label: "For Small Business", href: SEO_PAGES.toolsSmallBusiness.path }],
  cta: { label: "Browse AI tools", href: "/marketplace?category=automate-admin-work" },
  sections: [
    {
      kind: "prose",
      id: "why",
      title: "Why Small Businesses Look at AI Tools",
      lead: [
        "In a small business the administrative load does not scale down with headcount. Someone still has to answer the same questions, chase the same invoices, book the same appointments and keep the same records current — usually the owner, usually in the evening.",
        "That is the work AI tools fit. Not the judgement calls, not the relationships, but the repetitive middle that has real volume and a clear definition of done. The realistic outcome is hours back in a week and fewer things falling through, not a replacement for anyone on the team.",
      ],
    },
    {
      kind: "tasks",
      id: "where",
      title: "Where the Time Comes Back",
      lead: ["Ranked roughly by how often small businesses report a clear result:"],
      items: [
        {
          title: "Appointment scheduling",
          body: "Offering times, booking, sending reminders and rebooking no-shows. Pure logistics, low risk, and the fastest thing to switch on.",
        },
        {
          title: "First-line customer questions",
          body: "Hours, availability, delivery times, order status, what is and is not included. High volume, low variation, and answerable from what you have already written down.",
        },
        {
          title: "Follow-up",
          body: "Quotes that never got chased, enquiries that went quiet, reviews never asked for. The work is not hard, it just never reaches the top of the list.",
        },
        {
          title: "Invoice and receipt handling",
          body: "Reading documents, pulling out the numbers and getting them into your accounting system without retyping.",
        },
        {
          title: "Content drafting",
          body: "Service pages, listing copy, social posts and newsletters. Treat output as a first draft that still needs your voice on top.",
        },
        {
          title: "Recurring reports",
          body: "The weekly numbers someone currently rebuilds by hand. Worth automating precisely because it is identical every time.",
        },
      ],
    },
    {
      kind: "steps",
      id: "first",
      title: "Choosing a First Tool",
      items: [
        {
          title: "Pick the task you most resent doing",
          body: "It is usually the right answer. Resentment tracks volume and repetition closely, and both are what make automation worthwhile.",
        },
        {
          title: "Check it works with what you already use",
          body: "Your calendar, inbox, booking system, accounting software. A tool that does not connect to them moves work rather than removing it.",
        },
        {
          title: "Start with one thing",
          body: "A single workflow you can judge in a month. Buying three tools at once means you cannot tell which one earned its place.",
        },
        {
          title: "Keep approval on anything a customer sees",
          body: "Early on, have output drafted for you rather than sent for you. You can loosen this once you have seen enough of what it produces.",
        },
      ],
    },
    {
      kind: "checks",
      id: "budget",
      title: "What to Budget For",
      lead: ["The subscription is rarely the whole cost. Plan for:"],
      items: [
        "The subscription itself, checked at your real monthly volume rather than the headline tier.",
        "Setup time — connecting systems and writing down the answers the tool works from.",
        "A review habit in the first weeks, while you learn what it gets wrong.",
        "Possible help with integration if the connections are not off-the-shelf.",
        "A way out: know how you would export your data and stop, before you start.",
      ],
    },
  ],
  faqs: [
    {
      question: "Are AI tools worth it for a very small business?",
      answer:
        "It depends entirely on volume. If a task happens many times a week and is defined enough to write down, a tool can be worth it even at two or three people. If it happens occasionally and looks different each time, the setup effort usually outweighs the saving.",
    },
    {
      question: "Will AI tools replace my staff?",
      answer:
        "That is not what these products do well. They take repetitive, well-defined work off a person's plate. The parts of a small business that depend on judgement, relationships and accountability do not transfer, and the sensible deployments are built around keeping those with people.",
    },
    {
      question: "How long does it take to set an AI tool up?",
      answer:
        "A scheduling or first-line support tool with standard integrations can often be running within a few days. Anything that has to connect to an unusual system, or work from information you have not written down yet, takes longer — and the writing-down is usually the slow part.",
    },
  ],
  listing: {
    title: "AI Tools for Small Business on Ploy",
    emptyBody: "No admin listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=automate-admin-work",
    browseLabel: "Browse admin listings",
  },
  related: {
    keys: ["toolsHub", "smallBusiness", "appointmentScheduling", "customerSupport"],
    blurbs: {
      toolsHub: "The full picture of what AI tools cover and how to compare them.",
      smallBusiness: "The same ground from the AI employee angle, for standing roles.",
      appointmentScheduling: "Usually the single easiest place for a small business to start.",
      customerSupport: "Clearing the repeat questions that fill a small inbox.",
    },
  },
  closing: {
    title: "Find AI Tools That Fit Your Business",
    body: "Answer a few questions about how your business runs and get a free AI Report with recommendations sized to a small team, or browse the marketplace by the problem you want solved.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse AI tools", href: "/marketplace" },
  },
};

export const toolsSalesContent: SeoContent = {
  eyebrow: "Sales",
  heading: "AI Tools for Sales Teams",
  intro:
    "AI tools for sales cluster around the parts of the process with volume and repetition — research, first-touch outreach, follow-up, scheduling and CRM upkeep. The conversations that decide deals stay with your team.",
  trail: [homeCrumb, toolsCrumb, { label: "For Sales", href: SEO_PAGES.toolsSales.path }],
  cta: { label: "Browse AI sales tools", href: "/marketplace?category=generate-more-leads" },
  sections: [
    {
      kind: "tasks",
      id: "what",
      title: "What AI Sales Tools Cover",
      lead: ["Most products specialise in a few of these rather than spanning all of them:"],
      items: [
        {
          title: "Lead research and list building",
          body: "Assembling target lists against a profile you define and enriching them with the details needed to make contact.",
        },
        {
          title: "Inbound qualification",
          body: "Replying to an enquiry within minutes, asking the two or three questions that establish fit, and routing what qualifies to the right person.",
        },
        {
          title: "Outreach drafting",
          body: "First-touch email and message drafts personalised from whatever is known about the prospect, against a sequence you approve.",
        },
        {
          title: "Follow-up sequencing",
          body: "The messages after the first one. This is the task most often dropped by a busy team, and the one where consistency reliably recovers deals.",
        },
        {
          title: "Meeting scheduling",
          body: "Finding a time, sending the invite, and chasing no-shows to rebook without a chain of emails.",
        },
        {
          title: "CRM upkeep",
          body: "Logging activity, updating stages and filling fields after a call, so the pipeline reflects reality without evening data entry.",
        },
      ],
    },
    {
      kind: "prose",
      id: "limits",
      title: "Where These Tools Stop",
      lead: [
        "The parts of selling that decide outcomes do not transfer. Understanding an unusual requirement, handling a real objection, negotiating, and building a relationship over months are human work, and any product implying otherwise is overselling.",
        "Automation also amplifies whatever process it is pointed at. A clear, working sales process gets more consistent. A vague one produces more of the wrong activity, faster. If your team cannot write down what happens between an enquiry and a signed deal, fix that before buying anything.",
      ],
    },
    {
      kind: "checks",
      id: "questions",
      title: "What to Check Before Buying",
      items: [
        "Which CRM does it write to, and does it work with your pipeline stages as they are configured now?",
        "Can you review and edit sequences before anything sends, and is that the default?",
        "What triggers a handoff to a person, and does the rep get the full conversation history?",
        "How does it handle an unsubscribe or a request to stop contacting someone?",
        "Are messages sent from your domain, and what does that mean for your sending reputation?",
        "How does pricing behave as contact volume grows?",
      ],
    },
  ],
  faqs: [
    {
      question: "Can AI tools replace a sales rep?",
      answer:
        "No, and the products that work best are not designed to. They take the research, first-touch and admin load off a rep so more of the week goes into conversations. Discovery, objection handling and negotiation remain human work.",
    },
    {
      question: "Will AI outreach hurt our email deliverability?",
      answer:
        "It can, if volume rises sharply from a domain with no sending history, or if messages go to poorly matched lists and generate complaints. Ask any provider how sending is warmed up and throttled, and whether messages come from your domain or theirs.",
    },
  ],
  listing: {
    title: "AI Sales Tools on Ploy",
    emptyBody: "No sales listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=generate-more-leads",
    browseLabel: "Browse sales listings",
  },
  related: {
    keys: ["sales", "leadGeneration", "salesFollowUp", "toolsHub"],
    blurbs: {
      sales: "The same ground for tools built to run sales as a standing role.",
      leadGeneration: "Going deeper on finding and qualifying leads specifically.",
      salesFollowUp: "The follow-up problem on its own — where most warm deals are lost.",
      toolsHub: "How to compare AI tools across every part of a business.",
    },
  },
  closing: {
    title: "Find AI Sales Tools",
    body: "Browse the sales listings on the marketplace, or generate a free AI Report to see whether sales is the function worth automating first in your business.",
    primary: { label: "Browse AI sales tools", href: "/marketplace?category=generate-more-leads" },
    secondary: { label: "Generate a free AI Report", href: "/report" },
  },
};

export const toolsMarketingContent: SeoContent = {
  eyebrow: "Marketing",
  heading: "AI Tools for Marketing Teams",
  intro:
    "AI tools for marketing are strongest on production work — drafting, repurposing, research and reporting. Strategy, positioning and the decision about which bet to take next stay with the people accountable for the results.",
  trail: [homeCrumb, toolsCrumb, { label: "For Marketing", href: SEO_PAGES.toolsMarketing.path }],
  cta: { label: "Browse AI marketing tools", href: "/marketplace?category=create-marketing-content" },
  sections: [
    {
      kind: "tasks",
      id: "what",
      title: "What AI Marketing Tools Cover",
      items: [
        {
          title: "Content drafting",
          body: "Blog posts, landing page copy and product descriptions from a brief. The editing pass is what turns output into something you would publish.",
        },
        {
          title: "Repurposing",
          body: "Turning one piece of work into posts for each channel and a newsletter section. Mechanical, which is exactly what makes it a good fit.",
        },
        {
          title: "SEO research",
          body: "Finding the terms people actually use, grouping them by intent, and identifying where you have nothing to offer a searcher.",
        },
        {
          title: "Competitor monitoring",
          body: "Watching what competitors publish, price and change, and summarising it. Genuinely useful and almost never done consistently by hand.",
        },
        {
          title: "Email campaigns",
          body: "Drafting sequences, segmenting a list against defined rules, and preparing variants to test.",
        },
        {
          title: "Reporting",
          body: "Pulling numbers from analytics and ad platforms into a recurring summary with the changes worth noticing called out.",
        },
      ],
    },
    {
      kind: "prose",
      id: "review",
      title: "Why Review Still Matters",
      lead: [
        "Marketing output is public and attributed to you. A confident but wrong claim about your own pricing, a statistic with no source, or copy that reads nothing like your brand are all normal failure modes — cheap to catch before publishing and expensive afterwards.",
        "The setups that work treat drafting as the default and automatic publishing as something you earn into, reserved for the lowest-risk formats once you have seen enough output to trust it.",
      ],
    },
    {
      kind: "checks",
      id: "questions",
      title: "What to Check Before Buying",
      items: [
        "How does it learn your brand voice — a style guide, examples of past work, or a generic setting?",
        "Does anything publish automatically, or does everything go through approval first?",
        "Which platforms does it connect to — your CMS, scheduler, email tool, analytics?",
        "Where does its research come from, and can it show sources so claims can be checked?",
        "Who owns the output, and does the provider use your content to train anything?",
        "How does it handle factual claims about your product, pricing or results?",
      ],
    },
  ],
  faqs: [
    {
      question: "Will content written by AI rank in search?",
      answer:
        "Search engines judge content on whether it is helpful and original, not on how it was produced. Thin, generic output that restates what already ranks tends to do poorly regardless of its author. Drafts built on your own data, experience and point of view, then edited properly, are a different proposition.",
    },
    {
      question: "Can AI tools handle our brand voice?",
      answer:
        "Partially, and better when given real examples than a description. Most teams find output lands close enough to edit quickly rather than close enough to publish untouched. Ask how voice is configured before assuming it will match.",
    },
  ],
  listing: {
    title: "AI Marketing Tools on Ploy",
    emptyBody: "No marketing listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=create-marketing-content",
    browseLabel: "Browse marketing listings",
  },
  related: {
    keys: ["marketing", "contentCreation", "socialMedia", "toolsHub"],
    blurbs: {
      marketing: "The same ground for tools built to run marketing as a standing role.",
      contentCreation: "Going deeper on drafting and the editing pass that follows.",
      socialMedia: "Keeping a publishing schedule filled across channels.",
      toolsHub: "How to compare AI tools across every part of a business.",
    },
  },
  closing: {
    title: "Find AI Marketing Tools",
    body: "Browse the marketing listings on the marketplace, or generate a free AI Report to see where automation would make the most difference across your business.",
    primary: { label: "Browse AI marketing tools", href: "/marketplace?category=create-marketing-content" },
    secondary: { label: "Generate a free AI Report", href: "/report" },
  },
};

export const toolsCustomerServiceContent: SeoContent = {
  eyebrow: "Customer Service",
  heading: "AI Tools for Customer Service",
  intro:
    "AI tools for customer service take the repetitive share of a support queue — repeat questions, triage, routing and out-of-hours cover — so the team spends its time on the conversations that genuinely need a person.",
  trail: [homeCrumb, toolsCrumb, { label: "For Customer Service", href: SEO_PAGES.toolsCustomerService.path }],
  cta: { label: "Browse AI support tools", href: "/marketplace?category=improve-customer-support" },
  sections: [
    {
      kind: "tasks",
      id: "what",
      title: "What AI Customer Service Tools Cover",
      items: [
        {
          title: "Answering repeat questions",
          body: "Hours, delivery times, order status, what is and is not included. High volume, low variation, and the bulk of most inboxes.",
        },
        {
          title: "Answering from your own material",
          body: "Responding from your documented policies and help articles rather than general knowledge, so answers match what you actually offer.",
        },
        {
          title: "Triage",
          body: "Reading an incoming message, working out what it is about and how urgent it is, and tagging it so the queue is ordered before anyone opens it.",
        },
        {
          title: "Routing and escalation",
          body: "Sending a conversation to the right team with its history attached when it goes beyond what the tool should handle.",
        },
        {
          title: "Out-of-hours cover",
          body: "Acknowledging a message and handling what it can overnight, so nobody waits until Monday for a first reply.",
        },
        {
          title: "Knowledge base upkeep",
          body: "Flagging questions that come up often with no article behind them, and drafting new entries for review.",
        },
      ],
    },
    {
      kind: "steps",
      id: "escalation",
      title: "How Escalation Should Work",
      lead: [
        "Escalation is what decides whether this works in practice. A support tool that answers confidently when it should have asked for help creates more work than it saves:",
      ],
      items: [
        {
          title: "Handle the routine directly",
          body: "Questions covered by documented policy are answered straight away. This is where the volume is and where a fast answer genuinely serves the customer.",
        },
        {
          title: "Escalate on uncertainty, not just keywords",
          body: "A well-built tool hands over when it does not have a confident answer rather than producing a plausible one. Ask any provider how that threshold is decided.",
        },
        {
          title: "Escalate anything with consequences",
          body: "Refunds, cancellations, complaints, anything touching money or a legal obligation. These should route to a person by default.",
        },
        {
          title: "Pass on the full context",
          body: "When a person picks up they should see the conversation so far. Making the customer repeat themselves undoes most of the benefit.",
        },
      ],
    },
    {
      kind: "checks",
      id: "questions",
      title: "What to Check Before Buying",
      items: [
        "Where do answers come from — your help centre and policies, or general training data?",
        "What does it do when it does not know? Escalation is the answer you want.",
        "Which channels does it cover — email, live chat, help desk, social messages?",
        "Does it integrate with your existing help desk, or replace it?",
        "Can you see full transcripts and correct it afterwards?",
        "Is it clear to customers they are talking to an automated system, and can they ask for a person?",
      ],
    },
  ],
  faqs: [
    {
      question: "Do customers mind talking to an AI support tool?",
      answer:
        "Broadly, people mind waiting more than they mind automation — provided the answer is correct and a person is reachable when it is not. Frustration tends to come from tools that loop, guess confidently, or make asking for a human difficult. Being clear that it is automated, and offering an easy route to a person, matters more than hiding it.",
    },
    {
      question: "What happens if it gives a customer the wrong answer?",
      answer:
        "That is why scope and escalation settings matter. Keeping the tool to questions covered by documented policy, routing anything consequential to a person, and reviewing transcripts early are the practical defences. You remain responsible for what is said to your customers.",
    },
  ],
  listing: {
    title: "AI Customer Service Tools on Ploy",
    emptyBody: "No customer service listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=improve-customer-support",
    browseLabel: "Browse customer service listings",
  },
  related: {
    keys: ["customerService", "customerSupport", "toolsEcommerce", "toolsHub"],
    blurbs: {
      customerService: "The same ground for tools built to run support as a standing role.",
      customerSupport: "Response times and deflection as a problem in their own right.",
      toolsEcommerce: "Support volume specific to orders, returns and delivery.",
      toolsHub: "How to compare AI tools across every part of a business.",
    },
  },
  closing: {
    title: "Find AI Customer Service Tools",
    body: "Browse the customer service listings on the marketplace, or generate a free AI Report to see where support automation fits alongside the rest of your business.",
    primary: { label: "Browse AI support tools", href: "/marketplace?category=improve-customer-support" },
    secondary: { label: "Generate a free AI Report", href: "/report" },
  },
};

export const toolsRecruitingContent: SeoContent = {
  eyebrow: "Recruiting",
  heading: "AI Tools for Recruiting and Hiring",
  intro:
    "AI tools for recruiting take on the coordination and administration around hiring — sourcing, screening support, scheduling and candidate communication. Hiring decisions stay with the people accountable for them, and in several jurisdictions that is a legal requirement, not just good practice.",
  trail: [homeCrumb, toolsCrumb, { label: "For Recruiting", href: SEO_PAGES.toolsRecruiting.path }],
  cta: { label: "Browse AI recruiting tools", href: "/marketplace?category=improve-recruiting" },
  sections: [
    {
      kind: "tasks",
      id: "what",
      title: "What AI Recruiting Tools Cover",
      items: [
        {
          title: "Candidate sourcing",
          body: "Searching for candidates matching a defined brief and assembling a longlist with the details needed to make contact.",
        },
        {
          title: "Screening support",
          body: "Checking applications against stated requirements and surfacing what a reviewer needs to see. The output supports a human decision rather than replacing it.",
        },
        {
          title: "Interview scheduling",
          body: "Coordinating times across several calendars, sending invitations and handling reschedules. The clearest win in the whole process.",
        },
        {
          title: "Candidate communication",
          body: "Acknowledging applications, answering questions about the role, and keeping people informed about where they stand.",
        },
        {
          title: "Pipeline upkeep",
          body: "Moving candidates through stages, prompting interviewers for overdue feedback, and flagging applications that have stalled.",
        },
        {
          title: "Job description drafting",
          body: "Producing a first draft from a role brief for a hiring manager to review and correct.",
        },
      ],
    },
    {
      kind: "steps",
      id: "oversight",
      title: "Where Human Oversight Belongs",
      lead: [
        "Hiring decisions affect people's livelihoods and are regulated in ways most business automation is not. No AI system is free of bias — a model trained on past hiring data can reproduce the patterns in that data, including ones you would not choose to continue. Treat any claim of neutral or objective screening with scepticism.",
      ],
      items: [
        {
          title: "Keep hiring decisions with people",
          body: "Who advances, who is rejected and who is hired should be decided by someone who can explain the reasoning. Use these tools to prepare and organise information, not to decide on it.",
        },
        {
          title: "Treat screening output as a recommendation",
          body: "A ranking or score is an input to a review, not a verdict. Reviewers should see the underlying application and be able to disagree with the ordering.",
        },
        {
          title: "Know what is being assessed",
          body: "If you cannot find out what a screening feature actually measures, that is a reason for caution. You may have to explain a rejection to a candidate, a regulator or a court.",
        },
        {
          title: "Check your legal obligations",
          body: "Several jurisdictions regulate automated tools in hiring, with requirements that can include bias auditing, candidate notice and record keeping. Rules differ by location and change; take your own legal advice for the places you hire in.",
        },
      ],
      footnote: "This is general information about using these tools, not legal advice.",
    },
    {
      kind: "checks",
      id: "questions",
      title: "What to Check Before Buying",
      items: [
        "Which parts of the process does it touch, and does anything reject a candidate without human review?",
        "What does any scoring feature actually measure, and can that be explained to a candidate?",
        "Has the provider carried out bias testing, and will they share the results?",
        "Does it integrate with your applicant tracking system?",
        "Where is candidate data stored, how long is it kept, and how are data protection obligations handled?",
        "Are candidates told when they are interacting with an automated system?",
      ],
    },
  ],
  faqs: [
    {
      question: "Is it legal to use AI tools in hiring?",
      answer:
        "In most places yes, but with conditions that vary by jurisdiction and are changing. Requirements can include bias auditing, telling candidates an automated system is in use, keeping records, and ensuring a person makes the final decision. Take your own legal advice for the locations you hire in — this is general information, not legal advice.",
    },
    {
      question: "Can AI screening be biased?",
      answer:
        "Yes. A model trained on past hiring decisions can reproduce the patterns in that data. No provider can honestly claim their screening is neutral. The practical safeguards are keeping decisions with people, treating scores as one input among several, and asking providers for bias testing results.",
    },
  ],
  listing: {
    title: "AI Recruiting Tools on Ploy",
    emptyBody: "No recruiting listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=improve-recruiting",
    browseLabel: "Browse recruiting listings",
  },
  related: {
    keys: ["recruiting", "toolsSmallBusiness", "appointmentScheduling", "toolsHub"],
    blurbs: {
      recruiting: "The same ground for tools built to run recruiting as a standing role.",
      toolsSmallBusiness: "Where hiring support fits for a business hiring occasionally.",
      appointmentScheduling: "Interview scheduling is the same coordination problem.",
      toolsHub: "How to compare AI tools across every part of a business.",
    },
  },
  closing: {
    title: "Find AI Recruiting Tools",
    body: "Browse the recruiting listings on the marketplace, or generate a free AI Report to see which parts of your business are the best candidates for automation.",
    primary: { label: "Browse AI recruiting tools", href: "/marketplace?category=improve-recruiting" },
    secondary: { label: "Generate a free AI Report", href: "/report" },
  },
};

export const toolsRealEstateContent: SeoContent = {
  eyebrow: "Real Estate",
  heading: "AI Tools for Real Estate",
  intro:
    "Real estate runs on speed of response and consistent follow-up, and both are hard to maintain while showing properties. AI tools fit around the coordination — enquiry response, viewing scheduling, listing copy and pipeline chasing.",
  trail: [homeCrumb, toolsCrumb, { label: "For Real Estate", href: SEO_PAGES.toolsRealEstate.path }],
  cta: { label: "Browse AI tools", href: "/marketplace?category=generate-more-leads" },
  sections: [
    {
      kind: "tasks",
      id: "what",
      title: "Where AI Tools Fit in Real Estate",
      items: [
        {
          title: "Enquiry response",
          body: "Replying to a portal or website enquiry within minutes rather than hours, with the details on that property and a route to booking a viewing.",
        },
        {
          title: "Viewing coordination",
          body: "Offering times, booking around your calendar, sending reminders and rebooking cancellations — the scheduling load that fills an agent's day.",
        },
        {
          title: "Listing copy",
          body: "Drafting property descriptions from the facts and features, for you to check and correct before it goes live.",
        },
        {
          title: "Pipeline follow-up",
          body: "Keeping in touch with buyers and vendors who are not ready yet, which is where most missed business sits.",
        },
        {
          title: "Qualification",
          body: "Establishing budget, timeline, finance position and area before a viewing, so your time goes to people who can actually proceed.",
        },
        {
          title: "Admin and records",
          body: "Keeping the CRM current after a call or viewing, and preparing recurring vendor updates.",
        },
      ],
    },
    {
      kind: "prose",
      id: "care",
      title: "Where to Be Careful",
      lead: [
        "Property advertising is regulated, and descriptions carry real consequences. Anything a tool drafts about a property — measurements, tenure, condition, planning status, price — has to be checked against the facts before publication. A confident but wrong description is your liability, not the provider's.",
        "Fair housing and equivalent anti-discrimination rules also apply to how enquiries are handled and how properties are marketed. Automated filtering of enquiries needs care: a rule that seems commercially sensible can create a discriminatory outcome. Take your own legal advice for the markets you operate in.",
      ],
    },
    {
      kind: "checks",
      id: "questions",
      title: "What to Check Before Buying",
      items: [
        "Does it connect to the portals and CRM you already use?",
        "Can you review listing copy before it publishes?",
        "How does it handle an enquiry it cannot answer — does it escalate to you?",
        "Does it work from the actual property record, or generate description from a photo?",
        "What does it do with enquirer data, and how long is it kept?",
      ],
      footnote: "This is general information about using these tools, not legal advice.",
    },
  ],
  faqs: [
    {
      question: "Can AI write property listings?",
      answer:
        "It can draft them from the facts you supply, which saves time on the first version. Everything factual — measurements, tenure, condition, planning status — still has to be verified against the property record before publication, because advertising accuracy is regulated and the liability stays with the agent.",
    },
    {
      question: "Will an AI tool respond to portal enquiries fast enough to matter?",
      answer:
        "Response speed is one of the clearer advantages, since enquiries often arrive while agents are out. Whether it converts depends on the quality of the reply and how quickly a real conversation follows, not on the speed alone.",
    },
  ],
  listing: {
    title: "AI Tools for Real Estate on Ploy",
    emptyBody: "No matching listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=generate-more-leads",
    browseLabel: "Browse the marketplace",
  },
  related: {
    keys: ["toolsHub", "leadGeneration", "appointmentScheduling", "salesFollowUp"],
    blurbs: {
      toolsHub: "How to compare AI tools across every part of a business.",
      leadGeneration: "Capturing and qualifying enquiries before they go cold.",
      appointmentScheduling: "The viewing coordination problem on its own.",
      salesFollowUp: "Staying in touch with buyers and vendors who are not ready yet.",
    },
  },
  closing: {
    title: "Find AI Tools for Real Estate",
    body: "Browse the marketplace by the problem you want solved, or generate a free AI Report to see which parts of your operation would benefit most.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse AI tools", href: "/marketplace" },
  },
};

export const toolsEcommerceContent: SeoContent = {
  eyebrow: "Ecommerce",
  heading: "AI Tools for Ecommerce",
  intro:
    "Ecommerce generates exactly the kind of volume AI tools handle well — the same delivery questions, the same returns process, the same product copy problem across hundreds of SKUs. This covers where that works and where it does not.",
  trail: [homeCrumb, toolsCrumb, { label: "For Ecommerce", href: SEO_PAGES.toolsEcommerce.path }],
  cta: { label: "Browse AI tools", href: "/marketplace?category=improve-customer-support" },
  sections: [
    {
      kind: "tasks",
      id: "what",
      title: "Where AI Tools Fit in Ecommerce",
      items: [
        {
          title: "Order and delivery questions",
          body: "Where is my order, when will it arrive, can I change the address. The highest-volume, lowest-variation questions in the entire inbox.",
        },
        {
          title: "Returns and exchanges",
          body: "Walking a customer through the policy, issuing labels where rules allow, and escalating anything outside the standard case.",
        },
        {
          title: "Product descriptions",
          body: "Drafting copy across a large catalogue from structured attributes, which is otherwise a serious bottleneck at any scale.",
        },
        {
          title: "Post-purchase messaging",
          body: "Delivery updates, care instructions, review requests and replenishment reminders on a schedule.",
        },
        {
          title: "Pre-purchase questions",
          body: "Sizing, compatibility, materials and stock — answered from your product data rather than guessed.",
        },
        {
          title: "Merchandising analysis",
          body: "Pulling sales, return-rate and stock data into a recurring summary with the changes worth noticing flagged.",
        },
      ],
    },
    {
      kind: "prose",
      id: "care",
      title: "Where to Be Careful",
      lead: [
        "Product claims carry legal weight. A description that invents a material, a certification, a dimension or a compatibility is a consumer protection problem, and at catalogue scale nobody is reading every line. Generate from structured product data rather than free text, and sample-check output rather than trusting it wholesale.",
        "Anything touching money should route to a person by default. Refunds, goodwill gestures, cancellations and disputes are where an overconfident automated answer becomes expensive, and they are a small share of volume anyway.",
      ],
    },
    {
      kind: "checks",
      id: "questions",
      title: "What to Check Before Buying",
      items: [
        "Does it connect to your store platform and order system, so it can answer from real order data?",
        "Can it action anything — issue a refund, change an address — or only inform? Know which, and set it deliberately.",
        "Does product copy generate from structured attributes or from free text?",
        "How does it handle a question about stock or delivery it cannot verify?",
        "Can customers reach a person easily, and is it clear when they are not talking to one?",
      ],
    },
  ],
  faqs: [
    {
      question: "Can AI write product descriptions for a large catalogue?",
      answer:
        "This is one of the better-fitting uses, because the task is repetitive and the inputs are structured. The caution is factual accuracy: generate from real product attributes rather than free text, and sample-check output, since invented materials, dimensions or certifications create consumer protection problems.",
    },
    {
      question: "Should an AI tool be allowed to issue refunds?",
      answer:
        "Most retailers keep that with a person, at least initially. Refunds, goodwill gestures and disputes are a small share of volume but carry the highest cost when handled wrongly. A common middle ground is letting the tool prepare the case and a person approve it.",
    },
  ],
  listing: {
    title: "AI Tools for Ecommerce on Ploy",
    emptyBody: "No matching listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=improve-customer-support",
    browseLabel: "Browse the marketplace",
  },
  related: {
    keys: ["toolsHub", "toolsCustomerService", "customerSupport", "contentCreation"],
    blurbs: {
      toolsHub: "How to compare AI tools across every part of a business.",
      toolsCustomerService: "The wider support picture beyond order questions.",
      customerSupport: "Response times and deflection as a problem in their own right.",
      contentCreation: "Drafting at catalogue scale, and the checking that follows.",
    },
  },
  closing: {
    title: "Find AI Tools for Ecommerce",
    body: "Browse the marketplace by the problem you want solved, or generate a free AI Report to see where automation fits across your store operations.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse AI tools", href: "/marketplace" },
  },
};
