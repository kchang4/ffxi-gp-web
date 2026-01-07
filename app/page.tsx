import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import GP_Calculator from './components/GP_Calculator';
import { GuildData } from './types/guild';

async function getGuildData(): Promise<GuildData> {
  const filePath = path.join(process.cwd(), 'public', 'guild_data.json');
  const fileContents = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Home() {
  const guildData = await getGuildData();
  const themeCookie = (await cookies()).get('theme');
  const initialTheme = (themeCookie?.value as 'light' | 'dark') || 'light';

  return (
    <GP_Calculator
      initialGuildData={guildData}
      initialTheme={initialTheme}
    />
  );
}
