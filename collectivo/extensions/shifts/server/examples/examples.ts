import {
  createItem,
  createItems,
  deleteItems,
  readItems,
  readUsers,
} from "@directus/sdk";

import { DateTime } from "luxon";

const times_of_day = [10, 13, 16, 19];

export default async function examples() {
  console.info("Creating example data for shifts");

  await cleanShiftsData();
  await createShifts();
  await createSlots();
  await createSkills();
  await createAssignments();
  await addSkillsToUsers();

  console.info("Example data for shifts created");
}

async function cleanShiftsData() {
  const directus = await useDirectusAdmin();

  const schemas = [
    "shifts_shifts",
    "shifts_slots",
    "shifts_skills",
    "shifts_assignments",
    "shifts_skills_directus_users",
  ];

  for (const schema of schemas) {
    await directus.request(deleteItems(schema, { limit: 1000 }));
  }
}

async function createShifts() {
  const directus = await useDirectusAdmin();

  const monday = DateTime.now().startOf("week");
  const shiftsRequests: ShiftsShift[] = [];

  const nb_weeks = 3;

  for (let week = 0; week < nb_weeks; week++) {
    for (let weekday = 0; weekday < 5; weekday++) {
      const day = monday.plus({ days: weekday, week: week });

      for (const time_of_day of times_of_day) {
        shiftsRequests.push({
          shifts_name: "Shop (week " + ["A", "B", "C", "D"][week] + ")",
          shifts_from: day.set({ hour: time_of_day }).toString(),
          shifts_duration:
            time_of_day == times_of_day[times_of_day.length - 1] ? 150 : 180,
          shifts_repeats_every: nb_weeks * 7,
        });
      }
    }
  }

  await directus.request(createItems("shifts_shifts", shiftsRequests));
}

async function createSlots() {
  const directus = await useDirectusAdmin();

  const shifts = await directus.request(readItems("shifts_shifts"));
  const slotsRequests = [];

  for (const shift of shifts) {
    if (shift["shifts_time"] == times_of_day[times_of_day.length - 1]) {
      for (let i = 0; i < 2; i++) {
        slotsRequests.push({
          shifts_name: "Cleaning",
          shifts_shift: shift.id,
        });
      }
    } else {
      slotsRequests.push({
        shifts_name: "Cashier",
        shifts_shift: shift.id,
      });

      for (let i = 0; i < 2; i++) {
        slotsRequests.push({
          shifts_name: "Shelves",
          shifts_shift: shift.id,
        });
      }
    }
  }

  await directus.request(createItems("shifts_slots", slotsRequests));
}

async function createSkills() {
  const directus = await useDirectusAdmin();

  const cashierSkill = await directus.request(
    createItem("shifts_skills", {
      shifts_name: "Cashier",
    }),
  );

  await directus.request(
    createItem("shifts_skills", {
      shifts_name: "First aid",
    }),
  );

  const slots = await directus.request(
    readItems("shifts_slots", {
      fields: ["id"],
      filter: { shifts_name: { _eq: "Cashier" } },
    }),
  );

  const requests = [];

  for (const slot of slots) {
    requests.push({
      shifts_skills_id: cashierSkill.id,
      shifts_slots_id: slot.id,
    });
  }

  await directus.request(createItems("shifts_skills_shifts_slots", requests));
}

async function createAssignments() {
  const directus = await useDirectusAdmin();

  const slots = await directus.request(
    readItems("shifts_slots", {
      fields: ["id"],
    }),
  );

  const users = await directus.request(
    readUsers({
      fields: ["id"],
    }),
  );

  const assignments = [];

  for (const user of users) {
    const slot = slots.pop();

    if (!slot) {
      break;
    }

    assignments.push({
      shifts_from: DateTime.now().toString(),
      shifts_slot: slot.id,
      shifts_user: user.id,
    });
  }

  await directus.request(createItems("shifts_assignments", assignments));
}

async function addSkillsToUsers() {
  const directus = await useDirectusAdmin();

  const skills = await directus.request(
    readItems("shifts_skills", {
      fields: ["id", "shifts_name"],
    }),
  );

  if (!skills) return;

  const users = await directus.request(
    readUsers({
      fields: ["id"],
    }),
  );

  const links: ShiftsSkillUserLink[] = [];

  users.forEach((user, index) => {
    const skill = skills[index % skills.length];

    links.push({
      directus_users_id: user.id,
      shifts_skills_id: skill.id,
    });
  });

  await directus.request(createItems("shifts_skills_directus_users", links));
}
