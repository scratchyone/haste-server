import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default function Viewer(props) {
  return null;
}

export async function getServerSideProps(ctx) {
  const realId = ctx.params.id.split('.')[0];
  const props = await prisma.document.findFirst({
    where: {
      id: realId,
    },
  });
  ctx.res.setHeader('Content-type', 'text/plain');
  ctx.res.write(props.text);
  ctx.res.end();
}
