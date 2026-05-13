export async function fetchBootstrapData() {
    const response = await fetch("http://localhost:3000/api/bootstrap");

    if(!response.ok) {
        throw new Error("Error fetching bootstrap data")
    }

    const data = await response.json()

    return data;
}