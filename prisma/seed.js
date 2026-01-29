/**
 * Database Seed Script
 * 
 * Populates the database with initial data for testing and development.
 * Run with: npm run db:seed
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@esisa.ac.ma' },
    update: {},
    create: {
      email: 'admin@esisa.ac.ma',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'ESISA',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('User@123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@esisa.ac.ma' },
    update: {},
    create: {
      email: 'user@esisa.ac.ma',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'user',
      isActive: true,
    },
  });
  console.log('✅ Regular user created:', user.email);

  // Create professor user
  const profPassword = await bcrypt.hash('Prof@123', 12);
  const professor = await prisma.user.upsert({
    where: { email: 'professor@esisa.ac.ma' },
    update: {},
    create: {
      email: 'professor@esisa.ac.ma',
      password: profPassword,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'user',
      isActive: true,
    },
  });
  console.log('✅ Professor user created:', professor.email);

  // Create sample students
  const students = [
    {
      studentId: 'ESISA-2024-001',
      firstName: 'Ahmed',
      lastName: 'Benali',
      email: 'ahmed.benali@student.esisa.ac.ma',
      dateOfBirth: new Date('2000-05-15'),
      gender: 'male',
      phone: '+212 6 12 34 56 78',
      address: '123 Avenue Mohammed V',
      city: 'Fès',
      country: 'Morocco',
      postalCode: '30000',
      program: 'Computer Science',
      year: 3,
      gpa: 3.7,
      status: 'active',
      notes: 'Excellent student, dean\'s list',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-002',
      firstName: 'Fatima',
      lastName: 'Zahra',
      email: 'fatima.zahra@student.esisa.ac.ma',
      dateOfBirth: new Date('2001-03-22'),
      gender: 'female',
      phone: '+212 6 23 45 67 89',
      address: '45 Rue des Fleurs',
      city: 'Casablanca',
      country: 'Morocco',
      postalCode: '20000',
      program: 'Software Engineering',
      year: 2,
      gpa: 3.9,
      status: 'active',
      notes: 'Top performer in programming courses',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-003',
      firstName: 'Omar',
      lastName: 'Khattabi',
      email: 'omar.khattabi@student.esisa.ac.ma',
      dateOfBirth: new Date('1999-11-08'),
      gender: 'male',
      phone: '+212 6 34 56 78 90',
      address: '78 Boulevard Hassan II',
      city: 'Rabat',
      country: 'Morocco',
      postalCode: '10000',
      program: 'Data Science',
      year: 4,
      gpa: 3.5,
      status: 'active',
      notes: 'Working on AI research project',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-004',
      firstName: 'Sara',
      lastName: 'El Amrani',
      email: 'sara.elamrani@student.esisa.ac.ma',
      dateOfBirth: new Date('2002-07-30'),
      gender: 'female',
      phone: '+212 6 45 67 89 01',
      address: '12 Rue Ibn Sina',
      city: 'Marrakech',
      country: 'Morocco',
      postalCode: '40000',
      program: 'Computer Science',
      year: 1,
      gpa: 3.2,
      status: 'active',
      notes: 'New student, showing great potential',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-005',
      firstName: 'Youssef',
      lastName: 'Mansouri',
      email: 'youssef.mansouri@student.esisa.ac.ma',
      dateOfBirth: new Date('2000-01-12'),
      gender: 'male',
      phone: '+212 6 56 78 90 12',
      address: '90 Avenue FAR',
      city: 'Tangier',
      country: 'Morocco',
      postalCode: '90000',
      program: 'Cybersecurity',
      year: 3,
      gpa: 3.8,
      status: 'active',
      notes: 'Certified ethical hacker',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2023-010',
      firstName: 'Khadija',
      lastName: 'Bennani',
      email: 'khadija.bennani@student.esisa.ac.ma',
      dateOfBirth: new Date('1998-09-05'),
      gender: 'female',
      phone: '+212 6 67 89 01 23',
      address: '34 Rue Allal Ben Abdellah',
      city: 'Fès',
      country: 'Morocco',
      postalCode: '30000',
      program: 'Software Engineering',
      year: 5,
      gpa: 3.95,
      status: 'graduated',
      notes: 'Valedictorian of Class 2023',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-006',
      firstName: 'Mehdi',
      lastName: 'Tazi',
      email: 'mehdi.tazi@student.esisa.ac.ma',
      dateOfBirth: new Date('2001-12-18'),
      gender: 'male',
      phone: '+212 6 78 90 12 34',
      address: '56 Rue Moulay Ismail',
      city: 'Meknes',
      country: 'Morocco',
      postalCode: '50000',
      program: 'Data Science',
      year: 2,
      gpa: 3.4,
      status: 'active',
      notes: 'Passionate about machine learning',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-007',
      firstName: 'Imane',
      lastName: 'Fassi',
      email: 'imane.fassi@student.esisa.ac.ma',
      dateOfBirth: new Date('2000-04-25'),
      gender: 'female',
      phone: '+212 6 89 01 23 45',
      address: '23 Boulevard Zerktouni',
      city: 'Casablanca',
      country: 'Morocco',
      postalCode: '20100',
      program: 'Computer Science',
      year: 3,
      gpa: 3.6,
      status: 'active',
      notes: 'Full-stack development focus',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2022-015',
      firstName: 'Amine',
      lastName: 'Chraibi',
      email: 'amine.chraibi@student.esisa.ac.ma',
      dateOfBirth: new Date('1999-06-14'),
      gender: 'male',
      phone: '+212 6 90 12 34 56',
      address: '67 Avenue Mohammed VI',
      city: 'Agadir',
      country: 'Morocco',
      postalCode: '80000',
      program: 'Cybersecurity',
      year: 4,
      gpa: 2.8,
      status: 'suspended',
      notes: 'Academic probation - attendance issues',
      createdById: admin.id,
    },
    {
      studentId: 'ESISA-2024-008',
      firstName: 'Nadia',
      lastName: 'Alaoui',
      email: 'nadia.alaoui@student.esisa.ac.ma',
      dateOfBirth: new Date('2002-02-28'),
      gender: 'female',
      phone: '+212 6 01 23 45 67',
      address: '89 Rue Oued Zem',
      city: 'Oujda',
      country: 'Morocco',
      postalCode: '60000',
      program: 'Software Engineering',
      year: 1,
      gpa: 3.3,
      status: 'active',
      notes: 'Transfer student from Université Mohammed Premier',
      createdById: admin.id,
    },
  ];

  for (const student of students) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: student,
    });
  }
  console.log(`✅ ${students.length} students seeded`);

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('Default login credentials:');
  console.log('─────────────────────────────────────');
  console.log('Admin:     admin@esisa.ac.ma / Admin@123');
  console.log('User:      user@esisa.ac.ma / User@123');
  console.log('Professor: professor@esisa.ac.ma / Prof@123');
  console.log('─────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
