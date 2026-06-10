const cron = require('node-cron');
const { User, Attendance, LeaveRequest } = require('../models');

const markAbsent = async () => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const hari = new Date().getDay(); // 0 = Minggu, 6 = Sabtu

        // Skip Sabtu & Minggu
        if (hari === 0 || hari === 6) return;

        console.log(`[Scheduler] Menjalankan markAbsent untuk ${today}`);

        // Ambil semua user dengan role employee
        const users = await User.findAll({ where: { role: 'employee' } });

        for (const user of users) {
            // Cek apakah sudah ada attendance hari ini
            const sudahAbsen = await Attendance.findOne({
                where: { user_id: user.id, date: today },
            });

            // Kalau belum ada sama sekali → insert absent
            if (!sudahAbsen) {
                await Attendance.create({
                    user_id: user.id,
                    date: today,
                    status: 'absent',
                });
                console.log(`[Scheduler] ${user.name} ditandai absent`);
            }
        }

        console.log(`[Scheduler] Selesai markAbsent untuk ${today}`);
    } catch (err) {
        console.error('[Scheduler] Error:', err.message);
    }
};

// Jalankan setiap hari jam 23:59
// Format cron: detik menit jam tanggal bulan hariMinggu
cron.schedule('59 23 * * 1-5', markAbsent, {
    timezone: 'Asia/Jakarta',
});

// Export fungsi juga — kalau mau test manual lewat endpoint
module.exports = { markAbsent };