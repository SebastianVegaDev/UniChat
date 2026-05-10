import bootstrapMock from "../../../mock/fakeBackend.db.json";

export async function fetchBootstrapData() {
    await new Promise((resolve) => setTimeout(resolve,300));

    return bootstrapMock;
}