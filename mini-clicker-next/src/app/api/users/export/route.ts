import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from 'path';

interface UserStats {
    userId: number;
    username: string;
    firstName: string;
    lastName: string;
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

const USERS_DATA_FILE = path.join(process.cwd(), 'data', 'users.json');

async function loadUsersData(): Promise<UsersData> {
    try{
        const data = await fs.readFile(USERS_DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch {
        return {users: {}, lastUpdated: new Date().toISOString()};
    }
}

export async function GET() {
    try{
        const usersData = await loadUsersData();

        const exportData = {
            exportDate: new Date().toISOString(),
            summary: {
                totalUsers: Object.keys(usersData.users). length,
                totalGamesPlayed: Object.values(usersData.users).reduce((sum, user) => sum + user.gamesPlayed, 0),
                totalClicks: Object.values(usersData.users).reduce((sum, user) => sum + user.totalClicks, 0),
                maxBalance: Math.max(...Object.values(usersData.users).map(user => user.totalBalance), 0)
            },
            users: usersData.users,
            lastUpdated: usersData.lastUpdated
        }

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="mini-clicker-users-${new Date().toISOString().split('T')[0]}.json"`
            }
        })
    } catch (error) {
        console.error('Ошибка экспорта данных:', error)
        return NextResponse.json(
            {success: false, error: 'Ошибка экспорта данных'},
            {status: 500}
        )
    }
}