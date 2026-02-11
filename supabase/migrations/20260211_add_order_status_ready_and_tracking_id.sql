do $$
begin
  begin
    alter type public.order_status add value if not exists 'ready';
  exception
    when duplicate_object then null;
  end;

  begin
    alter type public.order_status add value if not exists 'cancelled';
  exception
    when duplicate_object then null;
  end;
end $$;

alter table public.orders add column if not exists tracking_id text;
