import prompts from 'prompts';
import signale from 'signale';
import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const { email, password, isAdmin, confirm } = await prompts([
  {
    type: 'text',
    name: 'email',
    message: "What is the user's email address?",
    validate: (value) =>
      /.+@.+\..+/.test(value) || 'Please enter a valid email address',
  },
  {
    type: 'password',
    name: 'password',
    message: "What is the user's password?",
  },
  {
    type: 'password',
    name: 'confirm',
    message: 'Confirm the password:',
  },
  {
    type: 'toggle',
    name: 'isAdmin',
    message: 'Is this user an admin?',
    active: 'yes',
    inactive: 'no',
  },
]);

if (password !== confirm) {
  signale.error('Passwords do not match');
  process.exit(1);
}

const hashedPassword = await hash(password, 10);
let prisma = new PrismaClient();
await prisma.user.create({
  data: {
    email,
    hash: hashedPassword,
    admin: isAdmin,
  },
});
signale.success(
  isAdmin ? 'Admin created successfully' : 'User created successfully'
);
