import { Sequelize } from "sequelize-typescript"
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository"
import EventDispatcher from "../../@shared/event/event-dispatcher"
import Customer from "../entity/customer"
import Address from "../value-object/address"
import CustomerCreatedEvent from "./customer-created.events"

import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model"
import EnviaConsoleLogHandler from "./handler/SendMensageWhenCustomerChangeAddress.event"
import EnviaConsoleLogHandler1 from "./handler/EnviaConsoleLogHandler1.event"
import EnviaConsoleLogHandler2 from "./handler/EnviaConsoleLogHandler2.event"
import SendMensageWhenCustomerChangeAddress from "./handler/SendMensageWhenCustomerChangeAddress.event"

describe("Unit teste Customer Events",()=>{
    
    let sequelize: Sequelize;
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([CustomerModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });
  


    it("Should register a customer created event handler",()=>{
        const eventDispatcher = new EventDispatcher()
        const eventhandler = new EnviaConsoleLogHandler1() ;


        eventDispatcher.register("CustomerCreatedEvent",eventhandler)

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventhandler);


        const eventHandler2 = new EnviaConsoleLogHandler2();
        eventDispatcher.register("CustomerCreatedEvent",eventhandler)
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            2
          );
          expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
          ).toMatchObject(eventHandler2);
    })




    it("Should notify a customer created event handler",async ()=>{
        const eventDispatcher = new EventDispatcher()
        const eventhandler = new EnviaConsoleLogHandler1() ;
        const eventhandler2 = new EnviaConsoleLogHandler2() ;
        
        const spy1Handler1=jest.spyOn(eventhandler,"handle")
        const spy2Handler=jest.spyOn(eventhandler2,"handle")

        eventDispatcher.register("CustomerCreatedEvent",eventhandler)
        eventDispatcher.register("CustomerCreatedEvent",eventhandler2)


    
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            2
          );


          expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
          ).toMatchObject(eventhandler);

          expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
          ).toMatchObject(eventhandler2);


          const customerRepository = new CustomerRepository();
          const customer = new Customer("1","Vitor Emerique")
          const address = new Address("Jujubata",10,"032404023023","Santanal-GO")
          customer.Address = address;
          customer.addRewardPoints(100)
          customer.activate();

          await customerRepository.create(customer)

          const customerCreatedEvent = new CustomerCreatedEvent(customer)

          

          eventDispatcher.notify(customerCreatedEvent)

          expect(spy1Handler1).toHaveBeenCalled()
          expect(spy2Handler).toHaveBeenCalled()

 
    })




    it("Should notify a customer change address event handler",async ()=>{
        const eventDispatcher = new EventDispatcher()
        const eventhandler = new EnviaConsoleLogHandler1() ;
        const eventhandlerChangeAddress = new  SendMensageWhenCustomerChangeAddress()
        
        const spy1Handler1=jest.spyOn(eventhandler,"handle")
        const spy2Handler=jest.spyOn(eventhandlerChangeAddress,"handle")

        eventDispatcher.register("CustomerCreatedEvent",eventhandler)
        eventDispatcher.register("CustomerCreatedEvent",eventhandlerChangeAddress)


    
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            2
          );


          expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
          ).toMatchObject(eventhandler);

          expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
          ).toMatchObject(eventhandlerChangeAddress);
          

          const customerRepository = new CustomerRepository();
          const customer = new Customer("1","Vitor Emerique")
          const address = new Address("Jujubata",10,"032404023023","Santanal-GO")
          customer.Address = address;
          customer.addRewardPoints(100)
          customer.activate();
        
          

          await customerRepository.create(customer)

          const addr = new Address("Capapa",11,"3248923489234","New york - MA")
          customer.changeAddress(addr)
          await customerRepository.update(customer)

          const customerCreatedEvent = new CustomerCreatedEvent(customer)

          

          eventDispatcher.notify(customerCreatedEvent)

          expect(spy1Handler1).toHaveBeenCalled()
          expect(spy2Handler).toHaveBeenCalled()

 
    })
})