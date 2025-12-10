import { test, expect } from '../../src/fixtures/test-fixtures';
import { LoginPage } from '../../src/page-objects/login-page';
import { HomePage } from '../../src/page-objects/home-page';
import { ShoppingCartPage } from '../../src/page-objects/shopping-cart-page';
import { CheckoutPage } from '../../src/page-objects/checkout-page';
import { OrderConfirmationPage } from '../../src/page-objects/order-confirmation-page';
import { NotificationPage } from '../../src/page-objects/notification-page';
import { logInfo } from '../../src/utils/logger';

// Test case: XPANBFLFA-54
test.describe('Order Notifications', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let shoppingCartPage: ShoppingCartPage;
  let checkoutPage: CheckoutPage;
  let orderConfirmationPage: OrderConfirmationPage;
  let notificationPage: NotificationPage;

  // Test credentials and payment details from test case
  const testCredentials = {
    email: 'test_user@example.com',
    password: 'TestPassword123'
  };

  const paymentDetails = {
    cardNumber: '4111 1111 1111 1111',
    expiry: '12/25',
    cvv: '123'
  };

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    shoppingCartPage = new ShoppingCartPage(page);
    checkoutPage = new CheckoutPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);
    notificationPage = new NotificationPage(page);

    // Navigate to login page
    await loginPage.goto('/login');
  });

  test('Verify push notification receipt after successful order placement', async () => {
    logInfo('Starting test for order notification after successful order placement');

    // Step 1: Login with test credentials
    await loginPage.login(testCredentials.email, testCredentials.password);
    
    // Verify user is on home screen after login
    const isHomeDisplayed = await homePage.isHomeScreenDisplayed();
    expect(isHomeDisplayed).toBeTruthy();

    // Step 2: Navigate to shopping cart
    await homePage.navigateToShoppingCart();
    
    // Verify items are present in the cart
    const productName = await shoppingCartPage.getProductName();
    const productPrice = await shoppingCartPage.getProductPrice();
    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();

    // Step 3: Proceed to checkout
    await shoppingCartPage.waitForNavigation(async () => {
      await shoppingCartPage.click('[data-test="proceed-to-checkout"]');
    });
    
    // Verify checkout page loaded with items and delivery options
    const areCartItemsDisplayed = await checkoutPage.areCartItemsDisplayed();
    const areDeliveryOptionsDisplayed = await checkoutPage.areDeliveryOptionsDisplayed();
    expect(areCartItemsDisplayed).toBeTruthy();
    expect(areDeliveryOptionsDisplayed).toBeTruthy();

    // Step 4: Select standard delivery option and proceed to payment
    await checkoutPage.selectDeliveryOption('standard');
    await checkoutPage.proceedToPayment();
    
    // Verify payment page is loaded
    const arePaymentMethodsDisplayed = await checkoutPage.arePaymentMethodsDisplayed();
    expect(arePaymentMethodsDisplayed).toBeTruthy();

    // Step 5: Enter payment details and complete payment
    await checkoutPage.enterPaymentDetails(
      paymentDetails.cardNumber,
      paymentDetails.expiry,
      paymentDetails.cvv
    );
    await checkoutPage.completePayment();
    
    // Verify order confirmation page is displayed
    const isOrderConfirmationDisplayed = await orderConfirmationPage.isOrderConfirmationDisplayed();
    expect(isOrderConfirmationDisplayed).toBeTruthy();

    // Step 6: Note the Order ID and total amount
    const orderId = await orderConfirmationPage.getOrderId();
    const totalAmount = await orderConfirmationPage.getTotalAmount();
    
    // Verify Order ID and total amount are displayed
    expect(orderId).toBeTruthy();
    expect(totalAmount).toBeTruthy();

    // Step 7: Wait for push notification (up to 30 seconds)
    await notificationPage.waitForPushNotification();

    // Step 8: Open the received notification
    await notificationPage.openPushNotification();
    
    // Verify notification contains correct order ID and total amount
    const notificationOrderId = await notificationPage.getNotificationOrderId();
    const notificationTotalAmount = await notificationPage.getNotificationTotalAmount();
    const isDeliveryTimeframeDisplayed = await notificationPage.isDeliveryTimeframeDisplayed();
    
    expect(notificationOrderId).toBe(orderId);
    expect(notificationTotalAmount).toBe(totalAmount);
    expect(isDeliveryTimeframeDisplayed).toBeTruthy();

    // Step 9: Verify notification directs to correct order details page
    const redirectsToCorrectPage = await notificationPage.verifyRedirectToOrderDetails(orderId);
    expect(redirectsToCorrectPage).toBeTruthy();
  });
});
