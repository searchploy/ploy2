import { SEO_PAGES } from "@/lib/seo/pages";
import type { SeoContent } from "@/lib/seo/content-types";

/**
 * Group C — the "AI for X" pages. Written around a single workflow and the
 * failure it currently has, rather than around a product category. These are
 * the main feeder into the AI Report: someone arriving from a problem query
 * usually does not yet know which category of tool they need.
 */

const homeCrumb = { label: "Home", href: "/" };
const toolsCrumb = { label: "AI Tools", href: SEO_PAGES.toolsHub.path };

export const leadGenerationContent: SeoContent = {
  eyebrow: "Lead Generation",
  heading: "AI for Lead Generation",
  intro:
    "Lead generation has two distinct problems — finding people worth contacting, and responding fast enough to the ones who contact you. AI is used on both, and it is considerably better at the second.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Lead Generation", href: SEO_PAGES.leadGeneration.path }],
  cta: { label: "Browse lead generation tools", href: "/marketplace?category=generate-more-leads" },
  sections: [
    {
      kind: "steps",
      id: "how",
      title: "How AI Is Used for Lead Generation",
      items: [
        {
          title: "Building target lists",
          body: "Searching for companies and people matching a profile you define — industry, size, location, technology, role — and assembling a list with the details needed to make contact.",
        },
        {
          title: "Enriching records",
          body: "Filling in what is missing on a lead you already have: role, company size, recent funding or hiring activity, contact details. Often more valuable than finding new names.",
        },
        {
          title: "Qualifying inbound enquiries",
          body: "Replying to a form submission within minutes, asking the questions that establish fit, and routing what qualifies to the right person with the answers attached.",
        },
        {
          title: "Scoring and prioritising",
          body: "Ordering a pipeline so attention goes to the leads most likely to convert, based on the signals available rather than on who submitted most recently.",
        },
        {
          title: "Re-engaging old leads",
          body: "Working through enquiries that went quiet months ago. Most produce nothing, which is exactly why it suits automation rather than a person's afternoon.",
        },
      ],
    },
    {
      kind: "prose",
      id: "speed",
      title: "Why Response Speed Is the Easiest Win",
      lead: [
        "Of everything on this page, replying quickly to inbound enquiries is the change with the clearest mechanism behind it. A person who has just filled in a form is, at that moment, thinking about your business. An hour later they are doing something else, and quite possibly talking to a competitor who replied first.",
        "This is also the lowest-risk thing to automate, because the first reply is not where deals are won or lost — it is an acknowledgement, two or three qualifying questions, and an offer of a time to talk. There is very little judgement in it, and handing it over costs nothing in relationship terms.",
      ],
    },
    {
      kind: "prose",
      id: "limits",
      title: "What AI Will Not Fix",
      lead: [
        "It will not fix an offer nobody wants. If enquiries are not converting because the pricing is wrong, the positioning is unclear or the product does not fit the market, generating more of them makes the problem louder rather than smaller.",
        "It will not fix an untracked pipeline either. If nobody knows which leads exist or what stage they are at, automation applied on top produces activity without visibility. Getting the basic record straight comes first.",
        "And volume is not the goal. Poorly matched outreach at scale damages your sending reputation, generates complaints and burns the list you were trying to build. The teams that do well with this send less, to better-matched people, more consistently.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Where to Start",
      items: [
        "Measure your current first-response time to an inbound enquiry. If it is over an hour, start there.",
        "Write down what makes a lead qualified. Automation cannot apply a rule you have not articulated.",
        "Check what your CRM already knows — enrichment on existing records often beats new list building.",
        "Pick one source of leads to automate first, rather than every channel at once.",
        "Keep a person reviewing the first weeks of output, especially anything sent in your name.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can AI find new customers for my business?",
      answer:
        "It can find and prioritise people matching a profile you define, and it can respond to enquiries quickly and consistently. It cannot tell you who your best customers are if you have not worked that out, and it will not create demand that does not exist. Treat it as leverage on a process that already works rather than a substitute for one.",
    },
    {
      question: "Is AI lead generation compliant with data protection rules?",
      answer:
        "That depends on how contact data is sourced and how you use it. Rules such as GDPR, CAN-SPAM and their equivalents govern lawful basis, consent and opt-out handling, and they apply regardless of whether a human or a tool did the sending. Ask providers where their data comes from, and take your own legal advice for the markets you operate in.",
    },
  ],
  listing: {
    title: "Lead Generation Tools on Ploy",
    emptyBody: "No lead generation listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=generate-more-leads",
    browseLabel: "Browse lead generation listings",
  },
  related: {
    keys: ["toolsSales", "salesFollowUp", "emailOutreach", "sales"],
    blurbs: {
      toolsSales: "The wider category of AI tools built around a sales process.",
      salesFollowUp: "What happens to the leads you already have but never chased.",
      emailOutreach: "The sending side — personalisation, deliverability and limits.",
      sales: "AI sales employees, for teams wanting a standing role rather than a task tool.",
    },
  },
  closing: {
    title: "See Which AI Tools Fit Your Pipeline",
    body: "Generate a free AI Report to see where your lead process is actually losing people, and which AI tools address that specific gap — or browse the marketplace directly.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse lead generation tools", href: "/marketplace?category=generate-more-leads" },
  },
};

export const customerSupportContent: SeoContent = {
  eyebrow: "Customer Support",
  heading: "AI for Customer Support",
  intro:
    "Most support queues are dominated by a small number of questions asked repeatedly. AI is used to clear that share so response times fall and the team's attention goes to the conversations that actually need judgement.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Customer Support", href: SEO_PAGES.customerSupport.path }],
  cta: { label: "Browse support tools", href: "/marketplace?category=improve-customer-support" },
  sections: [
    {
      kind: "prose",
      id: "shape",
      title: "The Shape of the Problem",
      lead: [
        "Look at a month of tickets and the distribution is usually lopsided. A handful of question types — order status, hours, delivery, password resets, what is included — make up a large share of volume, and none of them require anyone to think. Meanwhile the conversations that genuinely need a person wait behind them.",
        "That is the case for automation here. Not replacing support, but changing what your team spends the day on, and getting first-response times down to something that does not itself generate a complaint.",
      ],
    },
    {
      kind: "steps",
      id: "how",
      title: "How AI Is Used in Support",
      items: [
        {
          title: "Answering documented questions",
          body: "Responding from your help centre and policies rather than general knowledge, so answers match what you actually offer.",
        },
        {
          title: "Triage and tagging",
          body: "Reading an incoming message, working out the topic and urgency, and ordering the queue before anyone opens it.",
        },
        {
          title: "Drafting replies for agents",
          body: "A middle ground that many teams prefer: the tool writes, a person approves and sends. Faster than typing, with nothing going out unreviewed.",
        },
        {
          title: "Out-of-hours acknowledgement",
          body: "Handling what it can overnight and at weekends, so nobody waits until Monday for a first reply.",
        },
        {
          title: "Surfacing knowledge gaps",
          body: "Flagging questions that come up repeatedly with no article behind them — often the most useful output, because it improves your documentation permanently.",
        },
      ],
    },
    {
      kind: "prose",
      id: "deflection",
      title: "Measuring It Honestly",
      lead: [
        "Deflection rate is the metric providers like to quote and the easiest one to make look good. A conversation counts as deflected if the customer did not reach a human — including when they gave up, went to a competitor, or complained on social media instead.",
        "The measures worth tracking are resolution without escalation, first-response time, reopen rate on closed tickets, and customer satisfaction on automated conversations specifically. If satisfaction on automated threads is materially worse than on human ones, the deflection number is hiding a problem rather than describing a win.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Where to Start",
      items: [
        "Pull a month of tickets and count the top question types. That list is your scope.",
        "Check those answers are actually documented somewhere the tool can read.",
        "Start in draft mode — the tool writes, an agent sends — before letting anything reply directly.",
        "Set escalation to trigger on uncertainty, not just on keywords.",
        "Make reaching a person easy and obvious. Hiding it is the fastest way to turn a small problem into a public one.",
      ],
    },
  ],
  faqs: [
    {
      question: "What percentage of support tickets can AI handle?",
      answer:
        "It varies enormously by business, and any provider quoting a single number across all customers is guessing. What determines it is how concentrated your question mix is and how well documented the answers are. Counting your own top question types is a far better estimate than any benchmark.",
    },
    {
      question: "Should AI reply to customers directly or draft for an agent?",
      answer:
        "Drafting is the safer starting point and many teams stay there for anything non-routine. Direct replies make sense once you have seen enough output on a well-defined question set to trust it, and with escalation configured to hand over on uncertainty rather than push through.",
    },
  ],
  listing: {
    title: "Customer Support Tools on Ploy",
    emptyBody: "No customer support listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=improve-customer-support",
    browseLabel: "Browse support listings",
  },
  related: {
    keys: ["toolsCustomerService", "customerService", "toolsEcommerce", "appointmentScheduling"],
    blurbs: {
      toolsCustomerService: "The wider category of AI tools for support teams.",
      customerService: "AI customer service employees, for a standing role rather than a task tool.",
      toolsEcommerce: "Support volume specific to orders, returns and delivery.",
      appointmentScheduling: "Another high-volume coordination task worth taking off the queue.",
    },
  },
  closing: {
    title: "See Where Support Automation Fits",
    body: "Generate a free AI Report to see how support sits against the rest of your operation and which tools address your actual question mix, or browse the marketplace directly.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse support tools", href: "/marketplace?category=improve-customer-support" },
  },
};

export const appointmentSchedulingContent: SeoContent = {
  eyebrow: "Scheduling",
  heading: "AI for Appointment Scheduling",
  intro:
    "Scheduling is coordination with no judgement in it, which makes it the lowest-risk place most businesses can start with AI. Nothing about fairness, accountability or customer relationships is at stake in finding a mutually free hour.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Appointment Scheduling", href: SEO_PAGES.appointmentScheduling.path }],
  cta: { label: "Browse scheduling tools", href: "/marketplace?category=automate-admin-work" },
  sections: [
    {
      kind: "steps",
      id: "how",
      title: "What Scheduling Tools Handle",
      items: [
        {
          title: "Offering times",
          body: "Reading availability across one or several calendars and proposing slots that work, without the four-email exchange that usually precedes a booking.",
        },
        {
          title: "Booking and confirming",
          body: "Creating the event, sending the invitation and adding whatever the appointment needs — a location, a video link, a form to complete beforehand.",
        },
        {
          title: "Reminders",
          body: "Messaging ahead of the appointment. The single most effective lever on no-show rates, and entirely mechanical.",
        },
        {
          title: "Rescheduling",
          body: "Handling a cancellation, offering alternatives and rebooking without anyone picking up the thread manually.",
        },
        {
          title: "Chasing no-shows",
          body: "Following up afterwards to rebook, which is work that reliably gets skipped when someone is busy.",
        },
        {
          title: "Routing to the right person",
          body: "Sending an appointment to the right team member based on topic, location or availability rather than whoever answered.",
        },
      ],
    },
    {
      kind: "prose",
      id: "why-easy",
      title: "Why This Is the Easiest Place to Start",
      lead: [
        "Most of the caution that belongs around AI in a business comes from consequences: a wrong answer to a customer, an unfair hiring decision, a published claim that is not true. Scheduling has almost none of that. The worst realistic failure is an awkward double-booking, which is annoying and immediately fixable.",
        "It also has unusually clear measurement. Time-to-booking, no-show rate and the number of messages per appointment are all countable before and after, so you find out quickly whether it earned its subscription — which is a good habit to establish before you automate anything riskier.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "What to Check",
      items: [
        "Does it read and write to the calendar system you already use, across everyone involved?",
        "Can it respect buffers, travel time, working hours and the appointment types you offer?",
        "How does it handle time zones, and what does a customer in another country see?",
        "What happens when nothing is available — does it offer a waitlist or hand over to a person?",
        "Can customers cancel and rebook themselves without emailing you?",
        "What is stored about the people booking, and for how long?",
      ],
    },
  ],
  faqs: [
    {
      question: "How is this different from a normal booking link?",
      answer:
        "A booking link publishes your availability and waits. These tools work inside a conversation — reading an email or message thread, proposing times in context, handling the back-and-forth when the first options do not suit, and chasing reschedules. For straightforward cases a booking link is often enough and considerably cheaper.",
    },
    {
      question: "Will it reduce no-shows?",
      answer:
        "Reminders reliably help, and automating them means they actually get sent. How much depends on your appointment type and audience, so measure your own rate before and after rather than relying on a vendor's figure.",
    },
  ],
  listing: {
    title: "Scheduling Tools on Ploy",
    emptyBody: "No admin listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=automate-admin-work",
    browseLabel: "Browse admin listings",
  },
  related: {
    keys: ["toolsSmallBusiness", "customerSupport", "salesFollowUp", "toolsRecruiting"],
    blurbs: {
      toolsSmallBusiness: "Other low-risk places a small business can start.",
      customerSupport: "Clearing the repeat questions that surround booking.",
      salesFollowUp: "Chasing the meetings that got booked and then went quiet.",
      toolsRecruiting: "Interview scheduling is the same problem with more calendars.",
    },
  },
  closing: {
    title: "See Which AI Tools Fit Your Business",
    body: "Generate a free AI Report to see where scheduling sits against the rest of your operation, or browse the marketplace for tools that handle booking and coordination.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse scheduling tools", href: "/marketplace?category=automate-admin-work" },
  },
};

export const salesFollowUpContent: SeoContent = {
  eyebrow: "Sales",
  heading: "AI for Sales Follow-Up",
  intro:
    "Most deals that go quiet were not lost on price or product. Nobody circled back. Follow-up is the task that gets dropped first when a week is busy, and it is the one automation is best suited to hold.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Sales Follow-Up", href: SEO_PAGES.salesFollowUp.path }],
  cta: { label: "Browse sales tools", href: "/marketplace?category=generate-more-leads" },
  sections: [
    {
      kind: "prose",
      id: "why",
      title: "Why Follow-Up Fails",
      lead: [
        "It is nobody's fault in particular. A salesperson with live conversations in front of them will always prioritise those over a quote sent three weeks ago. The lead that needed one more nudge is invisible in a way that a ringing phone is not.",
        "The result is a pipeline where a meaningful share of the value sits in deals that simply stopped, without either side deciding anything. That is a process problem rather than a skill problem, which is why a tool can address it.",
      ],
    },
    {
      kind: "steps",
      id: "how",
      title: "What AI Handles",
      items: [
        {
          title: "Sequenced follow-up after first contact",
          body: "The second, third and fourth messages, sent on a schedule you set, stopping the moment someone replies.",
        },
        {
          title: "Quote and proposal chasing",
          body: "Following up on something sent and not answered, which is where the most immediately recoverable value usually sits.",
        },
        {
          title: "Post-meeting follow-through",
          body: "Sending what was promised on the call, and chasing the next step if it does not get booked.",
        },
        {
          title: "Stalled deal re-engagement",
          body: "Working through opportunities past a certain age with a message that gives an easy way to say no, which is more useful than silence.",
        },
        {
          title: "Handoff on reply",
          body: "The critical part: the moment a prospect responds with genuine interest, the thread goes to a person with the history attached.",
        },
      ],
    },
    {
      kind: "prose",
      id: "doing-well",
      title: "Doing It Without Becoming a Nuisance",
      lead: [
        "Automated follow-up done badly is worse than none. Sequences that ignore replies, chase people who have said no, or send six near-identical messages damage the relationship and your reputation together.",
        "The setups that work stop immediately on any reply, cap the number of touches, give every message a reason to exist beyond checking in, and make opting out easy. A prospect who declines cleanly is a better outcome than one who stops opening your email.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Where to Start",
      items: [
        "Count the deals in your pipeline with no activity in 30 days. That number is usually the argument on its own.",
        "Start with quotes and proposals sent but not answered — the shortest path to a result.",
        "Write the sequence yourself, or review it properly. It goes out in your name.",
        "Confirm replies stop the sequence automatically, and test that before launch.",
        "Set a cap on touches and an obvious way to opt out.",
      ],
    },
  ],
  faqs: [
    {
      question: "How many follow-ups is too many?",
      answer:
        "There is no universal number, and it depends on deal size, cycle length and how the first contact came about. What matters more is that each message has a reason to exist, that replies stop the sequence immediately, and that opting out is easy. A sequence that keeps going after someone declines is always too many.",
    },
    {
      question: "Will prospects know the follow-up is automated?",
      answer:
        "Often, yes — generic messages are recognisable. That is an argument for fewer, better-written touches drawing on real context from the conversation, rather than for trying to disguise the mechanism. Some jurisdictions and channels also have disclosure rules worth checking.",
    },
  ],
  listing: {
    title: "Sales Tools on Ploy",
    emptyBody: "No sales listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=generate-more-leads",
    browseLabel: "Browse sales listings",
  },
  related: {
    keys: ["leadGeneration", "emailOutreach", "toolsSales", "sales"],
    blurbs: {
      leadGeneration: "Finding and qualifying the leads that enter the pipeline.",
      emailOutreach: "The sending mechanics — personalisation and deliverability.",
      toolsSales: "The wider category of AI tools built around a sales process.",
      sales: "AI sales employees, for a standing role rather than a single task.",
    },
  },
  closing: {
    title: "See Where Your Pipeline Is Losing Deals",
    body: "Generate a free AI Report to see which parts of your sales process are leaking, and which AI tools address that specific gap.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse sales tools", href: "/marketplace?category=generate-more-leads" },
  },
};

export const socialMediaContent: SeoContent = {
  eyebrow: "Social Media",
  heading: "AI for Social Media",
  intro:
    "Social media punishes inconsistency more than it rewards brilliance, and consistency is a production problem. That is the part AI handles — turning one idea into several posts and keeping a schedule filled, with a person still approving what goes out.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Social Media", href: SEO_PAGES.socialMedia.path }],
  cta: { label: "Browse marketing tools", href: "/marketplace?category=create-marketing-content" },
  sections: [
    {
      kind: "steps",
      id: "how",
      title: "What AI Handles",
      items: [
        {
          title: "Repurposing across channels",
          body: "Taking one article, video or piece of research and adapting it to the format and length each channel wants. Mechanical work, and a genuine multiplier on effort already spent.",
        },
        {
          title: "Keeping the queue filled",
          body: "Preparing drafts ahead of each scheduled slot so there is always something ready, which is most of what consistency actually requires.",
        },
        {
          title: "Drafting replies",
          body: "Writing responses to comments and messages for approval, so engagement does not depend on someone being free at the right moment.",
        },
        {
          title: "Adapting tone per platform",
          body: "The same point written differently for a professional network than for a short-form video caption.",
        },
        {
          title: "Summarising performance",
          body: "Pulling engagement numbers into a recurring summary so you can see what actually landed rather than guessing.",
        },
      ],
    },
    {
      kind: "prose",
      id: "approval",
      title: "Why Approval Should Stay On",
      lead: [
        "Social posts are public, instant and screenshot-able. The failure modes are not subtle: a factual claim about your own product that is wrong, a tone-deaf post scheduled into a bad news cycle, or copy that sounds nothing like the account it went out from.",
        "None of that is expensive to prevent. A person glancing at a queue once a day catches essentially all of it, and costs a few minutes. Automatic publishing is something to earn into for the lowest-risk formats, not the default setting on day one.",
      ],
    },
    {
      kind: "prose",
      id: "limits",
      title: "What It Will Not Do",
      lead: [
        "It will not give you something worth saying. The accounts that work have a point of view, original material, or access to something other people do not have. A tool that produces more posts from nothing in particular produces more noise.",
        "It also will not read a room. Judging whether a moment is right for a particular post is contextual and social, and getting that wrong publicly is one of the more costly mistakes available here.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Where to Start",
      items: [
        "Start from content you already have — an article, a talk, a customer story — rather than asking for posts from scratch.",
        "Give it real examples of your voice, not a description of it.",
        "Keep approval on everything until you have seen a few weeks of output.",
        "Check what it connects to: your scheduler, your channels, your analytics.",
        "Decide who is accountable for what publishes. Automation does not move that.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can AI run our social media accounts entirely?",
      answer:
        "Technically some products will, but it is rarely a good idea. Publishing without review means nobody catches a wrong claim, a badly timed post or copy that misses your voice — all of which are public and immediate. Keeping a person on approval costs minutes a day and prevents most of what goes wrong.",
    },
    {
      question: "Will audiences be able to tell posts are AI-drafted?",
      answer:
        "Generic output is recognisable, which is an argument for editing rather than for volume. Posts built on your own material, data and perspective read very differently from posts generated about a topic in general. Some platforms also have their own disclosure rules worth checking.",
    },
  ],
  listing: {
    title: "Marketing Tools on Ploy",
    emptyBody: "No marketing listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=create-marketing-content",
    browseLabel: "Browse marketing listings",
  },
  related: {
    keys: ["contentCreation", "toolsMarketing", "marketing", "toolsHub"],
    blurbs: {
      contentCreation: "The source material that social repurposing depends on.",
      toolsMarketing: "The wider category of AI tools for marketing teams.",
      marketing: "AI marketing employees, for a standing role rather than a task tool.",
      toolsHub: "How to compare AI tools across every part of a business.",
    },
  },
  closing: {
    title: "See Which AI Tools Fit Your Marketing",
    body: "Generate a free AI Report to see where marketing sits against the rest of your operation, or browse the marketplace for tools that handle content and scheduling.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse marketing tools", href: "/marketplace?category=create-marketing-content" },
  },
};

export const contentCreationContent: SeoContent = {
  eyebrow: "Content",
  heading: "AI for Content Creation",
  intro:
    "AI is good at producing a draft and poor at knowing whether the draft is worth publishing. Understanding which half of the job it does is most of what separates useful content operations from ones that produce a lot and get read by nobody.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Content Creation", href: SEO_PAGES.contentCreation.path }],
  cta: { label: "Browse content tools", href: "/marketplace?category=create-marketing-content" },
  sections: [
    {
      kind: "steps",
      id: "how",
      title: "Where AI Genuinely Helps",
      items: [
        {
          title: "Outlines and structure",
          body: "Getting from a topic to a sensible shape. Fast, low-risk, and removes the part of writing most people stall on.",
        },
        {
          title: "First drafts",
          body: "Turning a brief and your source material into prose you can edit. The value is in having something to react to rather than something to publish.",
        },
        {
          title: "Repurposing",
          body: "One article into a newsletter, several social posts and a summary. Genuinely mechanical, and the highest-return use on this list.",
        },
        {
          title: "Research summaries",
          body: "Condensing sources, documents or transcripts into something usable, with the sources kept so claims can be checked.",
        },
        {
          title: "Bulk descriptive copy",
          body: "Product descriptions and listing copy across a large catalogue, generated from structured attributes rather than free text.",
        },
        {
          title: "Editing support",
          body: "Tightening, cutting length, adjusting reading level and catching the sentence that says nothing.",
        },
      ],
    },
    {
      kind: "prose",
      id: "editing",
      title: "The Editing Pass Is the Job",
      lead: [
        "A draft is not a piece of content. It is raw material that is confidently written, plausibly structured, and frequently wrong in ways that are hard to spot precisely because it is confidently written and plausibly structured.",
        "The pass that has to stay human is the one that checks facts, removes claims nothing supports, adds what only you know — your data, your customers, your experience — and makes it sound like a person with a point of view rather than a summary of the internet. That is also the pass that makes it worth reading.",
        "Teams that skip it publish faster and get read less. The tell is content that is technically about the topic and contains nothing a reader could not have guessed.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Practical Rules",
      items: [
        "Give it your material to work from — notes, transcripts, data, customer conversations — rather than asking it to write about a topic in general.",
        "Check every factual claim, statistic and product detail. Assume nothing is sourced unless you sourced it.",
        "Never publish claims about your own pricing, capabilities or results without verifying them.",
        "Decide who owns the output and whether your inputs train the provider's models.",
        "Judge output on whether a reader would find it useful, not on how much of it there is.",
      ],
    },
  ],
  faqs: [
    {
      question: "Does Google penalise AI-generated content?",
      answer:
        "Search guidance focuses on whether content is helpful and original rather than on how it was produced. In practice, thin output that restates what already ranks performs badly whoever wrote it, while material built on genuine expertise and original information performs well. The production method is less predictive than the substance.",
    },
    {
      question: "Who owns content that AI helped write?",
      answer:
        "That is set by the provider's terms, and they vary — including on whether your inputs are used for training. Copyright treatment of AI-assisted work also differs by jurisdiction and is still developing. Read the terms of any tool you rely on commercially, and take your own legal advice where it matters.",
    },
  ],
  listing: {
    title: "Content Tools on Ploy",
    emptyBody: "No marketing listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=create-marketing-content",
    browseLabel: "Browse marketing listings",
  },
  related: {
    keys: ["socialMedia", "toolsMarketing", "marketing", "toolsEcommerce"],
    blurbs: {
      socialMedia: "Turning one piece of content into a publishing schedule.",
      toolsMarketing: "The wider category of AI tools for marketing teams.",
      marketing: "AI marketing employees, for a standing role rather than a task tool.",
      toolsEcommerce: "Product copy at catalogue scale, and the accuracy checks it needs.",
    },
  },
  closing: {
    title: "See Which AI Tools Fit Your Content Work",
    body: "Generate a free AI Report to see where content sits against the rest of your operation, or browse the marketplace for tools that handle drafting and research.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse content tools", href: "/marketplace?category=create-marketing-content" },
  },
};

export const dataEntryContent: SeoContent = {
  eyebrow: "Admin",
  heading: "AI for Data Entry",
  intro:
    "Data entry is the clearest automation candidate most businesses have: high volume, well defined, and universally disliked. The catch is that a mistake propagates silently into every report built on top of it, so accuracy checks have to stay in the process.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Data Entry", href: SEO_PAGES.dataEntry.path }],
  cta: { label: "Browse admin tools", href: "/marketplace?category=automate-admin-work" },
  sections: [
    {
      kind: "steps",
      id: "how",
      title: "What AI Handles",
      items: [
        {
          title: "Reading documents",
          body: "Pulling structured information out of invoices, receipts, forms, contracts and statements — including scans and photographs, which older tools could not manage.",
        },
        {
          title: "Moving data between systems",
          body: "Getting information from one place into another where no integration exists. A large share of manual admin is exactly this.",
        },
        {
          title: "Cleaning records",
          body: "Standardising formats, merging duplicates and filling gaps in a database that has drifted over time.",
        },
        {
          title: "Categorising and coding",
          body: "Applying the right account code, category or tag against rules you define, at a consistency a tired person cannot match.",
        },
        {
          title: "Transcription and notes",
          body: "Turning calls and meetings into searchable text, and pulling out the actions and fields worth recording.",
        },
        {
          title: "Keeping records current",
          body: "Updating a CRM or system of record after an interaction, so the data reflects reality without an evening of catch-up.",
        },
      ],
    },
    {
      kind: "prose",
      id: "accuracy",
      title: "Accuracy Is the Whole Question",
      lead: [
        "Modern document extraction is good, and good is not the same as correct. On clean, consistent documents error rates are low. On a crumpled receipt, an unusual layout or a handwritten form, they are not — and the failure is quiet. Nothing crashes. A number is simply wrong, and it stays wrong in every report downstream.",
        "So the process matters as much as the tool. Confidence thresholds that route uncertain extractions to a person, validation rules that catch impossible values, and spot checks against source documents are what make this safe. A tool that reports how sure it is beats one that always sounds certain.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Where to Start",
      items: [
        "Pick one document type with consistent layout and real volume — invoices are the usual starting point.",
        "Run it alongside the manual process for a period and compare, rather than switching over outright.",
        "Ask whether the tool exposes confidence scores and can route low-confidence items for review.",
        "Add validation rules for values that cannot be right — negative totals, impossible dates, unknown suppliers.",
        "Keep the source document linked to the record, so anything questionable can be checked against the original.",
        "Confirm where documents are processed and stored, particularly for anything containing personal or financial data.",
      ],
    },
  ],
  faqs: [
    {
      question: "How accurate is AI at reading invoices and receipts?",
      answer:
        "On clean, consistently formatted documents it is generally strong. Accuracy falls on poor scans, unusual layouts and handwriting, and errors are silent rather than obvious. Ask providers for accuracy figures on documents resembling yours, and keep confidence thresholds and spot checks in the process regardless.",
    },
    {
      question: "Is it safe to send financial documents to an AI tool?",
      answer:
        "That depends on the provider's handling, and it is worth establishing before you start. Ask where processing happens, how long documents are retained, whether your data is used for training, and what certifications they hold. For regulated data, confirm the arrangement meets your own obligations.",
    },
  ],
  listing: {
    title: "Admin Tools on Ploy",
    emptyBody: "No admin listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=automate-admin-work",
    browseLabel: "Browse admin listings",
  },
  related: {
    keys: ["toolsSmallBusiness", "appointmentScheduling", "toolsHub", "smallBusiness"],
    blurbs: {
      toolsSmallBusiness: "Other admin work worth taking off an owner's evening.",
      appointmentScheduling: "The other classic low-risk starting point.",
      toolsHub: "How to compare AI tools across every part of a business.",
      smallBusiness: "AI employees for small business, for standing roles rather than tasks.",
    },
  },
  closing: {
    title: "See Which AI Tools Fit Your Admin Work",
    body: "Generate a free AI Report to see how much of your week goes into administration and which tools address the biggest share of it.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse admin tools", href: "/marketplace?category=automate-admin-work" },
  },
};

export const emailOutreachContent: SeoContent = {
  eyebrow: "Outreach",
  heading: "AI for Email Outreach",
  intro:
    "AI makes it trivial to send more personalised email than you could write by hand. Whether that helps depends almost entirely on restraint — the constraints that decide outcomes here are deliverability and relevance, not writing capacity.",
  trail: [homeCrumb, toolsCrumb, { label: "AI for Email Outreach", href: SEO_PAGES.emailOutreach.path }],
  cta: { label: "Browse outreach tools", href: "/marketplace?category=generate-more-leads" },
  sections: [
    {
      kind: "steps",
      id: "how",
      title: "What AI Handles",
      items: [
        {
          title: "Drafting from a brief",
          body: "Producing first-touch messages against a template and a value proposition you define.",
        },
        {
          title: "Personalisation at scale",
          body: "Adapting each message using what is known about the recipient — role, company, recent news, how they found you.",
        },
        {
          title: "Sequencing",
          body: "The follow-ups after the first message, on a schedule, stopping the moment someone replies.",
        },
        {
          title: "Send-time and volume control",
          body: "Spreading sending to mimic normal behaviour rather than dispatching a thousand messages at once.",
        },
        {
          title: "Reply classification",
          body: "Sorting responses into interested, not now, and stop contacting me — and acting on the last one properly.",
        },
        {
          title: "Testing variants",
          body: "Running alternative subject lines and openings and reporting what performs, rather than guessing.",
        },
      ],
    },
    {
      kind: "prose",
      id: "deliverability",
      title: "Deliverability Is the Real Constraint",
      lead: [
        "None of the above matters if your messages land in spam. Volume from a domain with no sending history, poorly matched lists that generate complaints, and mailbox providers that have grown considerably better at spotting bulk sending all push in the same direction.",
        "Damage here is slow to appear and slow to undo. By the time open rates fall, the reputation problem is already established, and it affects your ordinary business email too — invoices, replies to customers, everything from that domain. This is the main argument for sending less to better-matched people.",
        "Practical protections: warm up new domains gradually, keep volumes moderate, authenticate properly with SPF, DKIM and DMARC, remove bounces and complaints immediately, and watch reply rate as the health metric rather than send count.",
      ],
    },
    {
      kind: "prose",
      id: "legal",
      title: "Rules That Apply",
      lead: [
        "Commercial email is regulated, and the rules apply the same whether a person or a tool composed the message. Depending on where you and the recipient are, that can mean a lawful basis for contact, accurate sender identification, a working opt-out honoured promptly, and a physical address in the message.",
        "GDPR, CAN-SPAM, CASL and their equivalents differ in what they require, and consent rules for business contacts vary by country. Take your own legal advice for the markets you send into — this is general information, not legal advice.",
      ],
    },
    {
      kind: "checks",
      id: "start",
      title: "Where to Start",
      items: [
        "Get authentication right first — SPF, DKIM and DMARC — before increasing any volume.",
        "Send from a subdomain rather than your primary domain, so a reputation problem does not reach your ordinary mail.",
        "Start small and grow gradually. A new domain sending heavily is the fastest route to a spam folder.",
        "Narrow the list until you could justify every name on it to the person receiving it.",
        "Confirm opt-outs are honoured automatically and immediately, and test it.",
        "Track reply rate rather than open rate — opens have become unreliable, and replies are the point anyway.",
      ],
    },
  ],
  faqs: [
    {
      question: "Will AI-written outreach land in spam?",
      answer:
        "Filters respond to sending patterns, list quality, authentication and recipient complaints far more than to who composed the text. Where AI causes problems is indirectly, by making high volume easy. Sending less to better-matched recipients, from a properly authenticated domain warmed up gradually, matters much more than the wording.",
    },
    {
      question: "Is AI-personalised cold email legal?",
      answer:
        "Cold email is lawful in many jurisdictions subject to conditions — lawful basis or consent depending on location, honest sender identification, a working opt-out, and often a physical address. Requirements differ significantly between GDPR, CAN-SPAM and CASL regimes. Take your own legal advice for the markets you send into.",
    },
  ],
  listing: {
    title: "Outreach Tools on Ploy",
    emptyBody: "No lead generation listings are published yet. Browse the marketplace to see the current catalogue.",
    browseHref: "/marketplace?category=generate-more-leads",
    browseLabel: "Browse lead generation listings",
  },
  related: {
    keys: ["leadGeneration", "salesFollowUp", "toolsSales", "sales"],
    blurbs: {
      leadGeneration: "Building and qualifying the list before you send to it.",
      salesFollowUp: "What happens after the first message lands.",
      toolsSales: "The wider category of AI tools built around a sales process.",
      sales: "AI sales employees, for a standing role rather than a single task.",
    },
  },
  closing: {
    title: "See Which AI Tools Fit Your Outreach",
    body: "Generate a free AI Report to see where outreach sits against the rest of your sales process, or browse the marketplace for tools that handle sending and sequencing.",
    primary: { label: "Generate a free AI Report", href: "/report" },
    secondary: { label: "Browse outreach tools", href: "/marketplace?category=generate-more-leads" },
  },
};
