import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default function Viewer(props) {
  return (
    <pre
      style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}
    >
      <code>{props.text}</code>
    </pre>
  );
}

export async function getServerSideProps(context) {
  const realId = context.params.id.split('.')[0];
  const props = await prisma.document.findFirst({
    where: {
      id: realId,
    },
  });
  return {
    props: {
      ...props,
      id: realId,
      ...(context.params.id.split('.')[1]
        ? { extension: context.params.id.split('.')[1] }
        : {}),
    },
  };
}
