import * as React from 'react';
import { JSX, useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

interface InfiniteScrollLocalProps<T> extends React.HTMLProps<InfiniteScroll> {
  items: T[] | null | undefined;
  renderItem: (item: T, index: number) => JSX.Element;
  pageSize?: number;

  getScrollParent?(): HTMLElement | null;
}

const isTest = process.env.VITEST;

export default function InfiniteScrollLocal<T>({
  items,
  renderItem,
  pageSize,
  ...props
}: InfiniteScrollLocalProps<T>) {
  const [itemsLocal, setItemsLocal] = useState<T[]>([]);
  useEffect(() => {
    setItemsLocal([]);
  }, [items]);

  const loadMore = useCallback(() => {
    if (!items) return;
    setItemsLocal((itemsLocalPrev) => [
      ...itemsLocalPrev,
      ...items.slice(
        itemsLocalPrev.length,
        itemsLocalPrev.length + (pageSize ?? 10),
      ),
    ]);
  }, [items, pageSize]);

  const hasMore = useMemo(
    () => !!items && items.length > itemsLocal.length,
    [items, itemsLocal.length],
  );
  if (isTest) {
    return (
      <>
        {items?.map((item, index) => (
          <React.Fragment key={index}>{renderItem(item, index)}</React.Fragment>
        ))}
      </>
    );
  }

  return (
    <>
      {items && (
        <InfiniteScroll
          {...props}
          pageStart={0}
          loadMore={loadMore}
          hasMore={hasMore}
          initialLoad={true}
          useWindow={false}
        >
          {itemsLocal.map((item, index) => (
            <React.Fragment key={index}>
              {renderItem(item, index)}
            </React.Fragment>
          ))}
        </InfiniteScroll>
      )}
    </>
  );
}
