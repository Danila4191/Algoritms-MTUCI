import React from "react";
import { Link } from "react-router-dom";
import styles from "./main.module.css";

export const MainPage = ({ extraClass = "" }) => {
  return (
    <main className={`${styles.content} ${extraClass}`}>
      <div className={styles.title_box}>
        <h1 className={`text text_type_h1 text_color_h1 ${styles.title}`}>
          АЛГОРИТМЫ МТУСИ
        </h1>
      </div>
      <div className={styles.cards_box}>
        <Link className={styles.link} to="/module-one">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module one</p>
            <p className={`${styles.link__text} text`}>
              Сортировка выборкой и quicksort
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/module-two">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module two</p>
            <p className={`${styles.link__text} text`}>
              Интерполяционный поиск с простым рехэшированием
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/module-three">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module three</p>
            <p className={`${styles.link__text} text`}>
              Поиск ​Кнута-Морриса-Пратта
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/module-four">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module four</p>
            <p className={`${styles.link__text} text`}>Стэк</p>
          </div>
        </Link>
        <Link className={styles.link} to="/module-five">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module five</p>
            <p className={`${styles.link__text} text`}>
              Генерация фрактала Салфетки Серпинского
            </p>
          </div>
        </Link>
      </div>
      <div className={styles.title_box}>
        <h2 className={`text text_type_h2 text_color_h1 ${styles.title}`}>
          2 семестр
        </h2>
      </div>
      <div className={styles.cards_box}>
        <Link className={styles.link} to="/2S/module-one">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module one</p>
            <p className={`${styles.link__text} text`}>
              Инфиксная и постфиксная нотации
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/2S/module-two">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module two</p>
            <p className={`${styles.link__text} text`}>
              Методы динамического программирования
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/2S/module-three">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module three</p>
            <p className={`${styles.link__text} text`}>
              Задача о заполнении рюкзака
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/2S/module-four">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module four</p>
            <p className={`${styles.link__text} text`}>Коды Хаффмана</p>
          </div>
        </Link>
        <Link className={styles.link} to="/2S/module-five">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module five</p>
            <p className={`${styles.link__text} text`}>
             Алгоритмы построения минимального остовного дерева
            </p>
          </div>
        </Link>
             <Link className={styles.link} to="/2S/module-six">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module six</p>
            <p className={`${styles.link__text} text`}>
              Сетевые алгоритмы. Динамические алгоритмы поиска путей
            </p>
          </div>
        </Link>
        <Link className={styles.link} to="/2S/module-seven">
          <div className={`${styles.card} `}>
            <p className={`${styles.link__text} text_type_h3`}>Module seven</p>
            <p className={`${styles.link__text} text`}>Сетевые алгоритмы. Эвристические алгоритмы поиска путей.</p>
          </div>
        </Link>
  
      </div>
    </main>
  );
};
