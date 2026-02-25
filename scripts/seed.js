const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  console.log("Seeding start...");

  const vulns = [
    { name: "SQL Injection", category: "Injection", defaultLike: 4, defaultImp: 5 },
    { name: "Command Injection", category: "Injection", defaultLike: 4, defaultImp: 5 },
    { name: "LDAP Injection", category: "Injection", defaultLike: 3, defaultImp: 4 },
    { name: "Weak Password Policy", category: "Broken Authentication", defaultLike: 4, defaultImp: 4 },
    { name: "No Account Lockout", category: "Broken Authentication", defaultLike: 3, defaultImp: 4 },
    { name: "Session Hijacking", category: "Broken Authentication", defaultLike: 3, defaultImp: 4 },
    { name: "No HTTPS / TLS", category: "Sensitive Data Exposure", defaultLike: 4, defaultImp: 4 },
    { name: "Weak Encryption", category: "Sensitive Data Exposure", defaultLike: 3, defaultImp: 4 },
    { name: "Exposed Database Backup", category: "Sensitive Data Exposure", defaultLike: 3, defaultImp: 5 },
    { name: "IDOR", category: "Access Control Failures", defaultLike: 3, defaultImp: 4 },
    { name: "Privilege Escalation", category: "Access Control Failures", defaultLike: 3, defaultImp: 5 },
    { name: "Default Credentials", category: "Security Misconfiguration", defaultLike: 4, defaultImp: 4 },
    { name: "Directory Listing Enabled", category: "Security Misconfiguration", defaultLike: 3, defaultImp: 3 },
    { name: "Exposed Admin Panel", category: "Security Misconfiguration", defaultLike: 3, defaultImp: 4 },
    { name: "Open Unnecessary Ports", category: "Security Misconfiguration", defaultLike: 3, defaultImp: 4 },
    { name: "Cross-Site Scripting (XSS)", category: "Cross-Site Attacks", defaultLike: 4, defaultImp: 4 },
    { name: "Cross-Site Request Forgery (CSRF)", category: "Cross-Site Attacks", defaultLike: 3, defaultImp: 4 },
    { name: "No Audit Logs", category: "Logging & Monitoring Failure", defaultLike: 4, defaultImp: 3 },
    { name: "Outdated Server Software", category: "Dependency & Software Issues", defaultLike: 4, defaultImp: 4 },
  ];

  for (const v of vulns) {
    await prisma.vulnerability.upsert({
      where: { name: v.name },
      update: v,
      create: v,
    });
  }

  const controls = [
    { framework: "ISO27001", name: "Password policy enforced", mappedVulnName: "Weak Password Policy" },
    { framework: "ISO27001", name: "Account lockout after failed logins", mappedVulnName: "No Account Lockout" },
    { framework: "ISO27001", name: "TLS/HTTPS enforced", mappedVulnName: "No HTTPS / TLS" },
    { framework: "ISO27001", name: "Encryption for sensitive data", mappedVulnName: "Weak Encryption" },
    { framework: "ISO27001", name: "Audit logging enabled", mappedVulnName: "No Audit Logs" },
    { framework: "ISO27001", name: "Patch management / server updates", mappedVulnName: "Outdated Server Software" },
    { framework: "ISO27001", name: "Access control review & least privilege", mappedVulnName: "Privilege Escalation" },
    { framework: "ISO27001", name: "Backup policy & recovery tested", mappedVulnName: "Exposed Database Backup" },
  ];

  for (const c of controls) {
    // biar aman kalau di-run berkali-kali
    await prisma.control
      .create({ data: c })
      .catch(() => {});
  }

  const vulnCount = await prisma.vulnerability.count();
  const controlCount = await prisma.control.count();

  console.log("Seed done ✅", { vulnCount, controlCount });
}

run()
  .catch((e) => {
    console.error("Seed failed ❌", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });