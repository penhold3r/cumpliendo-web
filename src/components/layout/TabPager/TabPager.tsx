'use client';

import React, { type ReactNode } from 'react';
import styles from './TabPager.module.css';
import type { TabPagerProps } from './TabPager.types';

export function TabPager({ children, activeTab }: TabPagerProps) {
  const childrenArray = React.Children.toArray(children) as ReactNode[];

  return (
    <div className={styles.pager}>
      {childrenArray.map((child, index) => {
        const tabId = `tab-${index + 1}`;
        const isActive = activeTab === tabId;

        if (!isActive) return null;

        return (
          <div key={tabId} className={styles.tabPanel}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
