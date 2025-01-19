import fs from "node:fs";
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare("SELECT * FROM meals WHERE slug = ?").get(slug);
}
export async function saveMeal(meal) {
  // Generate slug from the title
  meal.slug = slugify(meal.title, { lower: true });

  // Sanitize instructions to prevent XSS
  meal.instructions = xss(meal.instructions);

  // Extract file extension
  const extension = meal.image.name.split(".").pop();
  const fileName = `${meal.slug}.${extension}`;

  // Save the image to the filesystem
  const filePath = `public/images/${fileName}`;
  const bufferedImage = Buffer.from(await meal.image.arrayBuffer()); // Convert to Buffer

  try {
    fs.writeFileSync(filePath, bufferedImage);
  } catch (err) {
    throw new Error("Saving image failed! " + err.message);
  }

  // Update meal's image path
  meal.image = `/images/${fileName}`;

  // Ensure that the meal includes the required `creator_email` field
  if (!meal.creator_email) {
    throw new Error("Creator email is required!");
  }

  // Save meal data to the database
  try {
    console.log(meal); // Check meal object to ensure all fields are populated
    db.prepare(
      `
      INSERT INTO meals (
        slug,
        title,
        image,
        summary,
        instructions,
        creator,
        creator_email
      ) VALUES (
        @slug,
        @title,
        @image,
        @summary,
        @instructions,
        @creator,
        @creator_email
      )
    `
    ).run(meal);
  } catch (err) {
    throw new Error("Saving meal to the database failed! " + err.message);
  }
}
