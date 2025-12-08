export const commands = [
  {
    name: "hello",
    description: "Example command to test plugin execution.",
    run: () => console.log("👋 Hello from your new Celsus plugin!")
  },
  {
    name: "info",
    description: "Shows plugin information.",
    run: () => console.log("ℹ️  This is your dev plugin template.")
  }
];
