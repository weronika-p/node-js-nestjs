const stripeSecretKey = 'pk_test_51P9Nc801b0sJkUJt86epKETKr6uc0yErhtpPPWU74RYxujEJ4DLwdtXcML1g0sfXaVGogp6MtPTOvEaxbFC6C4hH00dNxs8Umg';
const stripe = Stripe(stripeSecretKey);
const redirectToCheckout = (sessionId) => {
    stripe.redirectToCheckout({sessionId: sessionId});
}