import prompts from 'prompts';
import signale from 'signale';
import { PrismaClient } from '@prisma/client';

const { email } = await prompts([
  {
    type: 'text',
    name: 'email',
    message: "What is the user's email address?",
    validate: (value) =>
      /.+@.+\..+/.test(value) || 'Please enter a valid email address',
  },
]);

let prisma = new PrismaClient();
let user = await prisma.user.delete({
  where: {
    email,
  },
});
if (user) signale.success('User deleted successfully');
else signale.error('User not found');
