import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Staff role if it doesn't exist
  const existingStaffRole = await prisma.role.findFirst({
    where: {
      role: 'Staff',
    },
  });

  if (!existingStaffRole) {
    await prisma.role.create({
      data: {
        role: 'Staff',
        status: 'ACTIVE',
      },
    });
    console.log('Staff role created');
  } else {
    console.log('Staff role already exists');
  }

  // Create Admin role if it doesn't exist
  const existingAdminRole = await prisma.role.findFirst({
    where: {
      role: 'Admin',
    },
  });

  if (!existingAdminRole) {
    await prisma.role.create({
      data: {
        role: 'Admin',
        status: 'ACTIVE',
      },
    });
    console.log('Admin role created');
  } else {
    console.log('Admin role already exists');
  }

  // Seed VisaType values
  const visaTypes = [
    'European union',
    'Irish citizen',
    'Stamp 1G',
    'Stamp 2 Limited visa exemption',
    'Stamp 2 Limited Visa',
    'Stamp 4',
    'Other',
  ];

  for (const name of visaTypes) {
    const existing = await prisma.visaType.findFirst({ where: { name } });
    if (!existing) {
      await prisma.visaType.create({
        data: { name, status: 'ACTIVE' },
      });
      console.log(`VisaType '${name}' created`);
    } else {
      console.log(`VisaType '${name}' already exists`);
    }
  }

  // Seed AllDocuments values
  const documents = [
    'QQI level 5',
    'Dignity at work',
    'Cyber security',
    'Open disclosure',
    'Children First',
    'Fundamentals of General Data Protection (GDPR)',
    'Fire safety training',
    'Safeguarding of Vulnerable Adults',
    'Patient Moving and Handling',
    'Basic Life Support',
    'Hand Hygiene',
    'HACCP Training (Level 2)',
    'Infection Prevention and Control',
    'Management of Actual and Potential',
    'Aggressions (MAPA) – post specific/ CPI'
  ];

  for (const documentName of documents) {
    const existing = await prisma.allDocuments.findFirst({ 
      where: { documentName } 
    });
    if (!existing) {
      await prisma.allDocuments.create({
        data: { 
          documentName, 
          status: 'ACTIVE' 
        },
      });
      console.log(`Document '${documentName}' created`);
    } else {
      console.log(`Document '${documentName}' already exists`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
