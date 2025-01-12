// Компонент кнопки для взаимодействия с кошельком пользователя
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// useAnchorWallet - хук, с помощью которого мы создаем wallet, когда пользователь подключает кошелек.
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// Библиотека, использующая IDL файл Anchor программы для того, чтобы предоставить удобный API для вызова инструкций этой программы
import * as anchor from "@coral-xyz/anchor";
// Дефолтные стили для солановских компонентов
import "@solana/wallet-adapter-react-ui/styles.css";
// классы необходимые для работы с @coral-xyz/anchor
import { Program, AnchorProvider } from "@coral-xyz/anchor";
// импортируем IDL нашей программы
import idl from "./product_contract.json"
// Та же IDL, но написанная для работы с TypeScript
import { ProductContract } from "./product_contract"


function App() {
    // хук для создания соединения с RPC соланы
    const { connection } = useConnection();
    // Кошелек пользователя
    const wallet = useAnchorWallet();

    // функция вызывающая инструкцию initialize_ref_rate_pda
    const initRefIx = async () => {
        // если кошелек не подключен
        if (!wallet) {
            return;
        }

        // создаем экземпляр Anchor провайдера передавая в него кошелек пользователя
        const provider = new AnchorProvider(connection, wallet);
        // устанавливаем этого провайдера (if не обязательный)
        if (provider) {anchor.setProvider(provider)}
        // экземпляр описывающий нашу программу
        const program = new Program(idl as ProductContract);
        // проверка создался ли экземпляр программы
        if (!program) {
            console.log("Программа не инициализирована, подключите кошелек");
            return;
        }
        // создание и вызов транзакции
        try {
            // програмно выводим адрес ref_rate_pda аккаунта, который будет хранить инфу о % рефоводу и authority
            const [refRate] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("ref_rate", "utf-8")], program.programId)
            // собираем транзакцию используя экземпляр программы передавая необходимые аргументы внутрь названия инстуркции
            // .accounts({}) - аккаунты, необходимые для вызова инструкции, описаны в IDL. Некоторые аккунты, вроде System Program или самого User, отправляющего транзакцию можно не перечислять.
            // .signers([]) - подписи, необходимые для вызова инстуркции. Описаны в IDL отдельным флагом signer: true напротив описания аккаунта
            // по дефолту транзакция подписывается кошельком экземпляра provider (кошелек юзера) поэтому в этом случае дополнительных подписей не нужно
            // .rpc() отправляет транзакцию и возвращает signature
            const tx = await program.methods.initializeRefRatePda(new anchor.BN(50)).accounts({
                refRatePda: refRate,
            }).rpc();

            console.log("Transaction successfull: ", tx)

        } catch (error) {
            console.error(error);
        }
    };

  return (
      // !!! Компоненты должны быть обернуты в компоненты ConnectionProvider, WalletProvider, WalletModalProvider. Без этого функционал WalletMultiButton работать не будет
      // смотреть main.tsx
      <>
          <div>
              <h1>
                  Пример
              </h1>
          </div>
          <div>
              {/*Компонент кнопки подключения кошелька */}
              <WalletMultiButton className={''}/>
          </div>
          <div>
              {/* Отправляем транзакцию на нажатие кнопки */}
              <button onClick={initRefIx}>Init Ref rate PDA</button>
          </div>

      </>

  )
}

export default App
