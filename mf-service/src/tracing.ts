import { NodeSDK }
from "@opentelemetry/sdk-node";

import {
    getNodeAutoInstrumentations
}
from "@opentelemetry/auto-instrumentations-node";

import {
    ConsoleSpanExporter,
    SimpleSpanProcessor
}
from "@opentelemetry/sdk-trace-base";

const sdk = new NodeSDK({

    spanProcessors: [
        new SimpleSpanProcessor(
            new ConsoleSpanExporter()
        )
    ],

    instrumentations: [
        getNodeAutoInstrumentations()
    ]
});

sdk.start();

console.log("Tracing Initialized");