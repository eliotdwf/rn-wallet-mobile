export function formatDate(dateString: any) {
    // format date nicely
    // example: from this 👉 2025-05-20 to this 👉 May 20, 2025
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}