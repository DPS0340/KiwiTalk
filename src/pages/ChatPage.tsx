import { Long } from 'bson';
import { AttachmentTemplate, Chat as ChatObject, ChatChannel, ChatType, MoreSettingsStruct } from 'node-kakao';
import { PacketSyncMessageReq, PacketSyncMessageRes } from 'node-kakao/dist/packet/packet-sync-message';
import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AppContext } from '../App';
import ChatRoom from '../components/chat/chat-room/chat-room';
import EmptyChatRoom from '../components/chat/chat-room/empty-chat-room';
import SideBar from '../components/common/side-bar/side-bar';
import SidePanel from '../components/common/side-bar/side-panel';
import constants from '../constants';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding-top: ${(() => {
    switch (process.platform) {
      case 'darwin':
      case 'cygwin':
      case 'win32':
        return 20;
      default:
        return 0;
    }
  })()}px;
`;

const makeTemplate = constants.ChatModule.makeTemplate;

const records: boolean[] = [];

const ChatPage = (): JSX.Element => {
  const [channelList, setChannelList] = useState<ChatChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState(-1);
  const [accountSettings, setAccountSettings] = useState<MoreSettingsStruct>();
  const [chatList, setChatList] = useState<ChatObject[]>([]);
  const [inputText, setInputText] = useState('');

  const { client } = useContext(AppContext);

  const messageHook = (chat: ChatObject) => {
    setChatList((prev) => [...prev, chat]);
  };

  useEffect(() => {
    channelList.forEach(async (channel, index) => {
      if (index !== selectedChannel) return;
      if (records[index]) return;

      console.log(channel.Id.toString());
      const { LastTokenId: lastTokenId } = (
        await client.NetworkManager.requestPacketRes<PacketSyncMessageRes>(
          new PacketSyncMessageReq(
            channel.Id,
            Long.fromInt(1), 1, Long.fromInt(2),
          ),
        )
      );

      const pk = await client
        .NetworkManager
        .requestPacketRes<PacketSyncMessageRes>(
          new PacketSyncMessageReq(
            channel.Id,
            Long.fromInt(1),
            1,
            lastTokenId,
          ),
        );

      if (pk.ChatList.length < 1) return;
      let startId = pk.ChatList[0].prevLogId;
      const update: ChatObject[] = [];
      let chatLog: ChatObject[] | null | undefined;

      while (
        (
          chatLog = (
            await client
              .ChatManager
              .getChatListFrom(
                channel.Id,
                startId,
              )
          ).result
        ) && chatLog.length > 0) {
        update.push(...chatLog);
        if (
          startId.notEquals(chatLog[chatLog.length - 1].LogId)
        ) {
          startId = chatLog[chatLog.length - 1].LogId;
        }
      }
      setChatList((prev) => [...prev, ...update]);

      records[index] = true;
    });
  }, [selectedChannel]);

  useEffect(() => {
    (async () => {
      const list: ChatChannel[] = client.ChannelManager.getChannelList()
        .map((chatChannel) =>
          client.ChannelManager.get(chatChannel.Id),
        ) as ChatChannel[];

      setChannelList(list);

      try {
        const settings = await client.Auth.requestMoreSettings();
        setAccountSettings(settings);
      } catch (error) {
        alert('오류가 발생했습니다.\n' + error);
      }

      client.on('message', messageHook);
    })();
  }, []);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const channel = channelList[selectedChannel];
    if (!channel?.Id) return;
    if (inputText.length <= 0) return;

    try {
      if (inputText[0] === '/') {
        const cmd = inputText.split(/\s/g);
        switch (cmd[0]) {
          case '/photo': {
            const template = await makeTemplate(ChatType.Photo, cmd[1]);
            const result = await channel.sendTemplate(
              template as AttachmentTemplate,
            );
            if (result == null) {
              throw new Error();
            }

            setInputText('');
            messageHook(result);
            break;
          }
          case '/video': {
            const template = await makeTemplate(ChatType.Video, cmd[1]);
            const result = await channel.sendTemplate(
              template as AttachmentTemplate,
            );
            if (result == null) {
              throw new Error();
            }

            setInputText('');

            messageHook(result);
            break;
          }
          case '/file': {
            const template = await makeTemplate(ChatType.File, cmd[1]);
            const result = await channel.sendTemplate(
              template as AttachmentTemplate,
            );
            if (result == null) {
              throw new Error();
            }

            setInputText('');

            messageHook(result);
            break;
          }
        }
      } else {
        const result = await channel.sendText(inputText);
        if (result == null) {
          throw new Error();
        }
        setInputText('');

        messageHook(result);
      }
    } catch (error) {
      alert(`메시지 발송 중 오류 발생 ${error}`);
    }
  };

  return (
    <Wrapper>
      <SideBar/>
      <SidePanel
        channelList={channelList}
        accountSettings={accountSettings}
        onChange={
          async (selectedChannel) => {
            setSelectedChannel(selectedChannel);

            if (!channelList[selectedChannel]) return;
            await channelList[selectedChannel].chatON();
          }
        }/>
      {
        channelList[selectedChannel] ?
          <ChatRoom
            channel={channelList[selectedChannel]}
            selectedChannel={selectedChannel}
            chatList={
              chatList.filter(
                  (chat) => chat.Channel.Id.toString() === channelList[selectedChannel].Id.toString(),
              )
            }
            onInputChange={onChange}
            onSubmit={onSubmit}
            inputValue={inputText}/> :
          <EmptyChatRoom/>
      }
    </Wrapper>
  );
};

export default ChatPage;
