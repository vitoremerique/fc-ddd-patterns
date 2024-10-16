import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.events";

export default class SendMensageWhenCustomerChangeAddress
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    const address = `${event.eventData.Address.street}, ${event.eventData.Address.number}, ${event.eventData.Address.zip}, ${event.eventData.Address.city}`
    console.log(`Endereço do cliente ${event.eventData.id}, ${event.eventData.name} foi alterado para: ${address}`);
  }
}