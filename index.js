const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const { PromptTemplate } =require("langchain/prompts");
const { ConfluencePagesLoader } = require("langchain/document_loaders/web/confluence");


const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = process.env["AZURE_OPENAI_KEY"] ;
const username = process.env.CONFLUENCE_USERNAME;
const accessToken = process.env.CONFLUENCE_ACCESS_TOKEN;


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
    if (username && accessToken) {
        const loader = new ConfluencePagesLoader({
            baseUrl: "https://jasonkim5672.atlassian.com/wiki",
            spaceKey: "~EXAMPLE362906de5d343d49dcdbae5dEXAMPLE",
            username,
            accessToken,
        });
        const documents = await loader.load();
        console.log(documents);
    } else {
        console.log(
            "You must provide a username and access token to run this example."
        );
    }
//ATATT3xFfGF0ICpwsdJG6JOkbpvcssZrHx9A6bp2OaNVqfljEYiGTuE5ML0v5-IYKPiakVT8RdkRNk9JfrRsDKHMjV4CqcaEAt6MBZahEJLX59kH349IG-T2Rn2Y0xpTRjt2n-01s6U-nVvb2nNj0GKgdJnMh6O6V2jw5ZtzkmVnaEazIlJ0N1M=5B76FF25

    const formattedPrompt = await prompt.format({
         question: "잠실 캠퍼스 프록시 ip주소 알려줘"
         //question: "안정적인 JDK버전 추천해줘"
    });

    const result = await client.getChatCompletions(deploymentId, [{'role':'user' , 'content':formattedPrompt}]);

    for (const choice of result.choices) {
        console.log(choice.message.content);
    }
}

    main().catch((err) => {
        console.error("The sample encountered an error:", err);
    });

    module.exports = {main};
