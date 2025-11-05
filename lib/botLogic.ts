export const getBotResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  
  // Greetings
  if (msg.match(/^(hello|hi|hey|good morning|good afternoon|good evening)/)) {
    return "Hello! Welcome to KRUX Finance 👋\n\nI'm your virtual assistant. I can help you with:\n\n🏦 Loan Applications\n📄 Document Requirements\n📊 Application Status\n👤 Connect with Support Agent\n\nHow can I assist you today?";
  }
  
  // Loan application inquiries
  if (msg.includes('loan') && (msg.includes('apply') || msg.includes('application') || msg.includes('new'))) {
    return "Great! I can guide you through our loan application process.\n\n💼 We offer:\n• Business Loans (up to ₹50 Lakhs)\n• Personal Loans (up to ₹25 Lakhs)\n• Home Loans (up to ₹5 Crores)\n• Vehicle Loans (up to ₹15 Lakhs)\n• MSME Loans (up to ₹1 Crore)\n\nWhich loan type interests you?";
  }
  
  // Business loan specific
  if (msg.includes('business loan') || msg.includes('business')) {
    return "Business Loan Details:\n\n💰 Loan Amount: ₹1 Lakh - ₹50 Lakhs\n⏱️ Tenure: 1-7 years\n📉 Interest Rate: 10.5% onwards*\n\n✅ Required Documents:\n• Business proof (GST, Shop Act)\n• Income tax returns (2 years)\n• Bank statements (6 months)\n• Identity & Address proof\n\nWould you like to start an application?";
  }
  
  // Personal loan specific
  if (msg.includes('personal loan') || msg.includes('personal')) {
    return "Personal Loan Details:\n\n💰 Loan Amount: ₹50,000 - ₹25 Lakhs\n⏱️ Tenure: 1-5 years\n📉 Interest Rate: 11.5% onwards*\n\n✅ Minimal Documentation:\n• Salary slips (3 months)\n• Bank statements (6 months)\n• PAN & Aadhaar\n\nQuick approval in 24-48 hours!";
  }
  
  // Document requirements
  if (msg.includes('document') || msg.includes('documents') || msg.includes('papers')) {
    return "📋 Standard Documents Required:\n\n✓ Identity Proof: PAN Card (mandatory)\n✓ Address Proof: Aadhaar Card\n✓ Income Proof:\n  - Salaried: 3 months salary slips\n  - Self-employed: ITR for 2 years\n✓ Bank Statements: Last 6 months\n✓ Passport Photo: Recent\n\n📱 All documents can be uploaded digitally!\n\nNeed loan-specific document details?";
  }
  
  // Application status
  if (msg.includes('status') || msg.includes('track') || msg.includes('check application')) {
    return "I can help you track your application!\n\n🔍 Please provide your Application ID\n(Format: APP-XXXXX)\n\nYou can find it in:\n• SMS sent to your registered mobile\n• Email confirmation\n• Application receipt";
  }
  
  // Application ID provided
  if (msg.match(/app-?\d+/i)) {
    const appId = msg.match(/app-?\d+/i)?.[0].toUpperCase();
    return `📊 Application Status for ${appId}:\n\n✅ Current Status: Under Review\n📅 Last Updated: Today, 09:45 AM\n⏳ Expected Timeline: 2-3 business days\n\n📋 Next Steps:\n1. Document verification in progress\n2. Credit assessment pending\n3. Final approval awaited\n\nOur team will contact you soon!`;
  }
  
  // Interest rates
  if (msg.includes('interest') || msg.includes('rate') || msg.includes('emi')) {
    return "💳 Our Interest Rates:\n\n• Personal Loan: 11.5% - 18% p.a.\n• Business Loan: 10.5% - 16% p.a.\n• Home Loan: 8.5% - 10.5% p.a.\n• Vehicle Loan: 9.5% - 13% p.a.\n\n📱 Use our EMI calculator for estimates!\n\n*Rates depend on credit score and profile";
  }
  
  // Eligibility
  if (msg.includes('eligib') || msg.includes('qualify') || msg.includes('criteria')) {
    return "✅ Basic Eligibility Criteria:\n\n👤 Age: 21-65 years\n💼 Employment: Salaried/Self-employed\n💰 Minimum Income:\n  - Salaried: ₹25,000/month\n  - Self-employed: ₹3 Lakhs/year\n📊 Credit Score: 650+\n\n📝 Want to check your eligibility? Provide:\n• Monthly income\n• Employment type\n• Loan amount needed";
  }
  
  // Contact/Human agent
  if (msg.includes('agent') || msg.includes('human') || msg.includes('person') || 
      msg.includes('talk to') || msg.includes('speak to') || msg.includes('representative')) {
    return "🙋 Connecting you to our support team...\n\nA customer support agent will assist you shortly!\n\nAverage wait time: 2-3 minutes\n\nPlease stay connected.";
  }
  
  // Thank you
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're most welcome! 😊\n\nIs there anything else I can help you with?\n\n• Apply for a loan\n• Check document requirements\n• Track application status\n• Speak with an agent";
  }
  
  // Goodbye
  if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('exit')) {
    return "Thank you for contacting KRUX Finance! 👋\n\nFeel free to return anytime. We're here 24/7!\n\nHave a great day!";
  }
  
  // Default response
  return "I'm here to help! 😊\n\n🔍 I can assist you with:\n\n1️⃣ New loan applications\n2️⃣ Document requirements\n3️⃣ Application status tracking\n4️⃣ Interest rates & EMI\n5️⃣ Eligibility criteria\n6️⃣ Connect with support agent\n\nPlease tell me what you need, or type 'agent' to speak with our team!";
};

export const shouldEscalateToHuman = (message: string): boolean => {
  const triggers = [
    'human', 'agent', 'person', 'representative',
    'talk to someone', 'speak to', 'real person',
    'customer care', 'support', 'help me'
  ];
  return triggers.some(trigger => message.toLowerCase().includes(trigger));
};

export const getCategoryFromMessage = (message: string): string => {
  const msg = message.toLowerCase();
  if (msg.includes('document')) return 'Documents';
  if (msg.includes('status') || msg.includes('track')) return 'Status Check';
  if (msg.includes('loan') || msg.includes('apply')) return 'Loan Application';
  if (msg.includes('complain') || msg.includes('issue')) return 'Complaint';
  return 'General Inquiry';
};