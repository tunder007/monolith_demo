import { Body, Container, Heading, Html, Text } from "@react-email/components";

export interface WelcomeEmailProps {
  name: string;
  productName?: string;
}

export function WelcomeEmail({ name, productName = "the app" }: WelcomeEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Welcome, {name}!</Heading>
          <Text>Thanks for joining {productName}. We&apos;re glad you&apos;re here.</Text>
        </Container>
      </Body>
    </Html>
  );
}
