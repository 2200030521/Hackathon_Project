import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { trace } from '@opentelemetry/api';

const otlpUrl = process.env.OTEL_EXPORTER_OTLP_TRACES_URL || 'http://localhost:4318/v1/traces';

const traceExporter = new OTLPTraceExporter({
    url: otlpUrl
});

const sdk = new NodeSDK({
    spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

console.log('OpenTelemetry initialized');

const getTraceId = (): string | null => {
    const span = trace.getActiveSpan();
    if (!span) {
        return null;
    }
    return span.spanContext().traceId;
};

export { getTraceId };
