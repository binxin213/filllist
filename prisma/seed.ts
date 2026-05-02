import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const LOCATIONS = ['SBMU', 'Current Sensor', 'CSC', 'ETH', 'Module', 'MBMU'];
const APPLICANTS = ['钱七', '张三', '冯八', '蒋九', '陈六', '李四', '王五', '赵六', '孙七', '周八'];
const PROJECTS = ['华为智能组串维护', '宁德储能电站A期', '阳光电源海外项目', '比亚迪集装箱B系统', '特斯拉MegaPack二期', '本地测试项目C'];
const DESCRIPTIONS = ['均充失败', '绝缘故障', '通讯中断', '物理损坏', '采样精度超差', '固件升级失败', '过流保护', '温度异常', '电压不平衡'];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log('Seeding database with 200 records...');

  // 1. Clear existing data
  await prisma.repairRequest.deleteMany();

  const requests = [];

  for (let i = 0; i < 200; i++) {
    const applicationTime = randomDate(new Date(2023, 0, 1), new Date());
    // expected return is usually 7-30 days after application time
    const expectedReturn = new Date(applicationTime.getTime() + (Math.random() * 23 + 7) * 24 * 60 * 60 * 1000);
    
    requests.push({
      applicant: randomItem(APPLICANTS),
      serialNumber: `BMS-SN-${(1000 + i).toString().padStart(4, '0')}`,
      location: randomItem(LOCATIONS),
      applicationTime,
      projectName: randomItem(PROJECTS),
      description: randomItem(DESCRIPTIONS),
      expectedReturn,
    });
  }

  await prisma.repairRequest.createMany({
    data: requests,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
