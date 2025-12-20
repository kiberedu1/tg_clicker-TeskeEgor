import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from 'fs'
import path from "path";
import { error } from "console";

interface UserStats {
    userId: number;
    username?: string;
    firstName: string;
    lastName?: string;
    totalClicks: number;
    totalBalance: number;
    clickPowerLevel: number;
    autoClickerLevel: number;
    gamesPlayed: number;
    lastActive: string;
    joinDate: string;
}

interface UsersData {
    users: Record<string, UserStats>;
    lastUpdated: string;
}

const USERS_DATA_FILE = path.join(process.cwd(), 'data', 'users.json')
const USE_MEMORY_STORAGE = process.env.VERCEL === '1'

let memoryStore: UsersData = { users: {}, lastUpdated: new Date().toISOString() }

async function ensureDataDirectory() {
    const dataDir = path.join(process.cwd(), 'data')
    try {
        await fs.access(dataDir)
    } catch {
        await fs.mkdir(dataDir, { recursive: true })
    }
}

async function loadUsersData(): Promise<UsersData> {
    try {
        if (USE_MEMORY_STORAGE) {
            return memoryStore
        }
        await ensureDataDirectory()
        const data = await fs.readFile(USERS_DATA_FILE, 'utf8')
        return JSON.parse(data) // ← Добавьте эту строку!
    } catch {
        return { users: {}, lastUpdated: new Date().toISOString() }
    }
}


async function saveUsersData(data: UsersData): Promise<void> {
    if (USE_MEMORY_STORAGE) {
        memoryStore = data;
        return
    }
    await ensureDataDirectory();
    await fs.writeFile(USERS_DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
    try {
        const usersData = await loadUsersData();
        return NextResponse.json({
            success: true,
            data: {
                totalUsers: Object.keys(usersData.users).length,
                topPlayers: Object.values(usersData.users)
                    .sort((a, b) => b.totalBalance - a.totalBalance)
                    .slice(0, 10),
                lastUpdated: usersData.lastUpdated,
            }
        });
    } catch {
        console.error('Ошибка загрузки статистики:', error);
        return NextResponse.json({ success: false, error: 'Ошибка загрузки данных' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, username, firstName, lastName, gameStats } = body;

        if (!userId || !firstName) {
            return NextResponse.json({ success: false, error: 'Необходимы userId и firstName' },
                { status: 400 }
            );
        }

        const usersData = await loadUsersData();
        const userKey = userId.toISOString();
        const existingStats = usersData.users[userKey]

        const now = new Date().toISOString();
        const updatedStats: UserStats = {
            userId,
            username,
            firstName,
            lastName,
            totalClicks: (existingStats?.totalClicks || 0) + (gameStats?.clicks || 0),
            totalBalance: Math.max(existingStats?.totalBalance || 0) + (gameStats?.balance || 0),
            clickPowerLevel: Math.max(existingStats?.clickPowerLevel || 0) + (gameStats?.clickPowerLevel || 0),
            autoClickerLevel: Math.max(existingStats?.autoClickerLevel || 0) + (gameStats?.autoClickerLevel || 0),
            gamesPlayed: Math.max(existingStats?.gamesPlayed || 0, 1),
            lastActive: now,
            joinDate: existingStats?.joinDate || now,
        }

        usersData.users[userKey] = updatedStats
        usersData.lastUpdated = now

        await saveUsersData(usersData)

        return NextResponse.json({
            success: true,
            data: updatedStats
        })
    } catch (error) {
        console.log('Ошибка обновления статистики', error)
        return NextResponse.json(
            {success: false, error: 'Ошибка сохранения данных'},
            {status: 500}
        )
    }
}