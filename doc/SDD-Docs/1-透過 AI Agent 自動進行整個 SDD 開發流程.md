呼叫Gemini CLI助手幫我執行 Spec Kit 自動化開發流程，步驟如下：

(1). 使用 Gemini CLI
gemini -y

(2). 設定 Agent 任務，提示詞如下：

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

你是一個負責執行 Spec Kit 流程的 AI 助手，會主動幫我叫用 `copilot` 命令完成任務，你主要有以下任務：

1. 先整理用戶的提示詞，寫入 `PROMPT.txt` 檔案

2. 幫用戶執行 `copilot` 命令，執行的命令範本如下：

   若是第一次執行，命令如下：

   <command>
   type PROMPT.txt | copilot --allow-all-tools --allow-all-paths --model claude-sonnet-4.5
   </command>

   若是之後的命令，命令如下：

   <command>
   type PROMPT.txt | copilot --allow-all-tools --allow-all-paths --model claude-sonnet-4.5 --continue
   </command>

3. 當執行 `copilot` 命令結束後，撰寫一份 zh-tw 的摘要總結當成 commit 訊息，並且直接將變更 commit 進版控

4. 如果任務尚未完成，並且 copilot 有建議的下一步，只要不是進入下一個階段，那就請繼續執行！

5. 請不要直接執行下一個 Slash command，若嘗試要執行下一個 Slash command，請暫時停止你的任務。

請你先告訴我你的理解。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

預期回應如下：

好的，我明白了。

  我的任務是擔任您的 AI 助手，專門執行 Spec Kit 流程。我的工作流程如下：

   1. 整理提示詞：我會將您的需求整理後，寫入 PROMPT.txt 檔案。
   2. 執行 copilot：我會自動幫您執行 copilot 命令。
       * 首次執行：type PROMPT.txt | copilot --allow-all-tools --allow-all-paths --model
         claude-sonnet-4.5
       * 後續執行：type PROMPT.txt | copilot --allow-all-tools --allow-all-paths --model
         claude-sonnet-4.5 --continue
   3. 版本控制：copilot 任務結束後，我會撰寫一份繁體中文的變更摘要，並以此作為 commit
      訊息，將所有變更提交到 Git。
   4. 持續執行：如果 copilot 建議了下一步驟，且不屬於新的階段（Slash
      command），我會自動繼續執行，直到當前任務完成。
   5. 停止條件：我不會自動執行下一個階段的 Slash
      command。當任務進展到需要下一個階段時，我會停止並等待您的指示。

  我已經準備好，請提供您的第一個指令。


(3).確認上述理解正確後，開始實作，輸入以下提示詞：
<PROMPT>
/speckit.implement
</PROMPT>