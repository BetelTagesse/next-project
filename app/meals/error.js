"use client";

export default function Error({ error }) {
  return (
    <main className="error">
      <h1>an error occured!</h1>
      <p>Failed to fetch data. Please try again later.</p>
    </main>
  );
}
