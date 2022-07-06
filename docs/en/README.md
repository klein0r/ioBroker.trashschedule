![Logo](../../admin/trashschedule.png)

# ioBroker.trashschedule

## Preconditions

1. Create a new instance of the **ical adapter**
2. Configure url of your calendar (e.g. google calendar)
3. Set "Preview days" to a range which includes every trash type at least twice (e.g. 45 days)
4. If you use the "events" tab, ensure to enable the "display" checkbox for each event type which should also be used in your trash schedule (otherwise the event will be hidden by the ical instance)

![ical](./img/ical.png)

## Configuration

1. Create a ```trashschedule``` instance and choose the ical instance as source
2. Go to the trash types tab and add as many types as you have trash types
3. Define a name for each new trash type and configure the matching events
4. Start the instance

**Questions?** Check the [FAQ](./faq.md)

![trashschedule](./img/trashschedule.png)

![trashschedule_types](./img/trashschedule_types.png)

## VIS Widget

![VIS widget](./img/vis.png)
