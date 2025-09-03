export function getDeployment() {
  return {
    name: "Deep Agent",
    deploymentUrl: process.env.NEXT_PUBLIC_DEPLOYMENT_URL || "http://localhost:8000",
    agentId: process.env.NEXT_PUBLIC_AGENT_ID || "deepagent",
  };
}
