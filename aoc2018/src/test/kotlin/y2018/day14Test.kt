package y2018

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.io.File

class day14Test {

    @Test
    fun test1() {
        assertEquals("5158916779", day14(9))
    }

    @Test
    fun test2() {
        assertEquals("0124515891", day14(5))
    }
    
    @Test
    fun test3() {
        assertEquals("9251071085", day14(18))
    }

    @Test
    fun test4() {
        assertEquals("5941429882", day14(2018))
    }

    @Test
    fun testActual() {
        assertEquals("2111113678", day14(286051))
    }

    @Test
    fun test1Part2() {
        assertEquals(9, day14Second("51589"))
    }

    @Test
    fun test2Part2() {
        assertEquals(5, day14Second("01245"))
    }

    @Test
    fun test3Part2() {
        assertEquals(18, day14Second("92510"))
    }

    @Test
    fun test4Part2() {
        assertEquals(2018, day14Second("59414"))
    }
    
    @Test
    fun test5Part2() {
        assertEquals(56251, day14Second("121518"))
    }

    @Test
    fun testActualSecond() {
        assertEquals(20195114, day14Second("286051"))
    }
}
