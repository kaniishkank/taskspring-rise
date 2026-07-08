import cron from 'node-cron';
import { db } from '../db.js';
import { sendWhatsAppMessage } from '../services/whatsapp.js';
import { format } from 'date-fns';

export function initializeCronJobs() {
  console.log('[Cron] Initializing background jobs...');

  // Run every morning at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Running daily morning digest at 8:00 AM');
    await sendDailyDigests();
  });

  console.log('[Cron] Background jobs successfully registered.');
}

async function sendDailyDigests() {
  try {
    // Find all users who have WhatsApp enabled and a valid phone number
    const users = await db.user.findMany({
      where: {
        notifyWhatsApp: true,
        phoneNumber: { not: null },
      },
      include: {
        tasksToDo: {
          where: {
            status: { notIn: ['completed'] }
          },
          include: {
            assignedBy: true
          }
        }
      }
    });

    const now = new Date();
    const todayStr = format(now, 'yyyy-MM-dd');

    for (const user of users) {
      if (!user.phoneNumber || user.tasksToDo.length === 0) continue;

      let dueToday = 0;
      let overdue = 0;
      let digestText = `🌅 *Good morning ${user.name}!* Here is your Mahatma Global Gateway daily digest:\n\n`;

      const tasksToHighlight = [];

      for (const task of user.tasksToDo) {
        const dueStr = format(task.dueDate, 'yyyy-MM-dd');
        if (dueStr === todayStr) {
          dueToday++;
          tasksToHighlight.push(`- 📌 *${task.title}* (Due Today)`);
        } else if (task.dueDate < now) {
          overdue++;
          tasksToHighlight.push(`- ⚠️ *${task.title}* (OVERDUE)`);
        }
      }

      if (dueToday === 0 && overdue === 0) {
        continue; // Nothing urgent to report today
      }

      digestText += `You have *${dueToday}* task(s) due today and *${overdue}* overdue task(s).\n\n`;
      digestText += tasksToHighlight.slice(0, 5).join('\n'); // Show top 5
      
      if (tasksToHighlight.length > 5) {
        digestText += `\n...and ${tasksToHighlight.length - 5} more.`;
      }

      digestText += `\n\nPlease log in to the TaskFlow dashboard to view your complete list and submit your work. Have a great day!`;

      // Send the digest via WhatsApp
      await sendWhatsAppMessage(user.phoneNumber, digestText);
    }
  } catch (error) {
    console.error('[Cron] Error running daily digest:', error);
  }
}
