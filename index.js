const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { PromptTemplate } =require("langchain/prompts");

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = process.env["AZURE_OPENAI_KEY"] ;

// const prompt = [{'role':'user', 'content':'hello azure gpt'}] ;
const prompt = PromptTemplate.fromTemplate(
    `You are an employee of IT company that got of keeping security with using intranet.
     When answer the question below, if question is associated with security, network, etc, check it from confluence agent first
     - question : {question}
     `
);


async function main() {
    console.log("== Get completions Sample ==");

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "gpt-4";
    const formattedPrompt = await prompt.format({
        product: "잠실 캠퍼스 프록시 ip주소 알려줘",
    });

    const result = await client.getChatCompletions(deploymentId, formattedPrompt);

    for (const choice of result.choices) {
        console.log(choice.message.content);
    }


    main().catch((err) => {
        console.error("The sample encountered an error:", err);
    });

    module.exports = {main};
}
