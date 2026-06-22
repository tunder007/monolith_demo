import { Body, Button, Container, Heading, Html, Text } from "@react-email/components";

export interface ResetPasswordEmailProps {
  resetUrl: string;
}

export function ResetPasswordEmail({ resetUrl }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>Reset your password</Heading>
          <Text>Click the button below to choose a new password. If you didn&apos;t request this, ignore this email.</Text>
          <Button href={resetUrl}>Reset password</Button>
        </Container>
      </Body>
    </Html>
  );
}
